import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { MdAccountBalanceWallet, MdInfoOutline } from 'react-icons/md';
import { BsTextLeft, BsStack } from 'react-icons/bs';
import Box from '../../components/Box';
import Button from '../../components/Button';
import Accordion from '../../components/Accordion';

import { shimmer, toBase64 } from '../../utils/placeholder';

import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { config } from '../../config';
import { useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import BoxSkeleton from '../../components/Skeletons/BoxSkeleton';
import Modal from '../../components/Modal';

import { toast } from 'react-toastify';
import { colors } from '../../styles/colors';
import { GlobalContext } from '../../context';

export async function getServerSideProps(context) {
  const path = context.resolvedUrl.split('?')[0];
  try {
    let protocol = 'https';
    if (process.env.NODE_ENV === 'development') {
      protocol = 'http';
    }

    const host = context.req.headers.host;

    const res = await fetch(`${protocol}://${host}/api/cache?page=${path}`);
    const data = await res.json();

    const cacheData = JSON.parse(data?.data);

    return {
      props: {
        path,
        cacheData: cacheData || null,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      props: {
        path,
        cacheData: null,
      },
    };
  }
}

export default function Asset({ path, cacheData }) {
  const router = useRouter();
  const { asset } = router.query;

  const { address: addr } = useContext(GlobalContext);

  const [listing, setListing] = useState(cacheData || null);
  const [loading, setLoading] = useState(false);

  const [buyModal, setBuyModal] = useState(false);
  const [buyInProgress, setBuyInProgress] = useState(false);

  const [maxQuantity, setMaxQuantity] = useState(1);
  const [quantity, setQuantity] = useState(1);

  const onClose = () => setBuyModal(false);

  useEffect(() => {
    const getAsset = async () => {
      if (!cacheData) {
        setLoading(true);
      }
      let provider;
      if (addr) {
        provider = new ethers.providers.Web3Provider(
          window.ethereum
        ).getSigner();
      } else {
        provider = new ethers.providers.JsonRpcProvider(
          config.FALLBACK_RPC_URL
        );
      }
      try {
        const sdk = new ThirdwebSDK(provider);
        const marketplace = sdk.getMarketplace(config.MARKETPLACE_ADDRESS);
        const listing = await marketplace.getListing(asset);
        setListing(listing);
        setMaxQuantity(listing?.quantity.toNumber());
        setLoading(false);
        await fetch('/api/cache', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            page: path,
            data: listing || {},
          }),
        });
      } catch (err) {
        console.log(err);
      }
    };
    getAsset();
  }, [asset, cacheData, path, addr]);

  const buyItem = async () => {
    toast.promise(
      new Promise(async (resolve, reject) => {
        setBuyInProgress(true);
        if (!addr || !window.ethereum) {
          reject('Please connect a wallet!');
          setBuyInProgress(false);
          return null;
        }
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        try {
          const sdk = new ThirdwebSDK(provider.getSigner());
          const marketplace = sdk.getMarketplace(config.MARKETPLACE_ADDRESS);
          const quantityDesired = 1;
          let data = await marketplace.buyoutListing(
            listing.id,
            quantityDesired
          );
          setBuyInProgress(false);
          resolve('Transaction Successful!');
          setTimeout(() => {
            router.push('/profile');
          }, 1000);
        } catch (err) {
          console.log(err);
          reject(err?.data?.message || err?.message || err);
          setBuyInProgress(false);
        }
      }),
      {
        loading: 'Transaction in progress...',
        success: (data) => `${String(data)}`,
        error: (data) => `${String(data)}`,
      }
    );
  };

  const unlistItem = async () => {
    toast.promise(
      new Promise(async (resolve, reject) => {
        setBuyInProgress(true);
        if (!window.ethereum) {
          reject('Please connect a wallet!');
          setBuyInProgress(false);
          return null;
        }
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        try {
          const sdk = new ThirdwebSDK(provider.getSigner());
          const marketplace = sdk.getMarketplace(config.MARKETPLACE_ADDRESS);
          let data = await marketplace.direct.cancelListing(asset);
          setBuyInProgress(false);
          resolve('Unlisting Successful!');
          setTimeout(() => {
            router.push('/profile');
          }, 2000);
        } catch (err) {
          console.log(err);
          reject(err?.data?.message || err?.message || err);
          setBuyInProgress(false);
        }
      }),
      {
        loading: 'Unlisting in progress...',
        success: (data) => `${String(data)}`,
        error: (data) => `${String(data)}`,
      }
    );
  };

  return (
    <>
      <Head>
        <title>
          {listing?.asset?.name || asset} - Listing | Fantasy NFT Marketplace
        </title>
      </Head>
      {loading && <BoxSkeleton />}
      <StyledAsset>
        <AssetFlex>
          <Left>
            <div className="asset-image">
              <Image
                src={
                  listing?.asset?.image ? listing?.asset?.image : '/logo.png'
                }
                alt={listing?.asset?.name}
                width={1700}
                height={2000}
                layout="responsive"
                unoptimized
                placeholder="blur"
                blurDataURL={`data:image/svg+xml;base64,${toBase64(
                  shimmer(200, 200)
                )}`}
              />
            </div>
          </Left>
          <Right>
            <p className="info__title">{listing?.asset?.name}</p>

            <div className="info__stats">
              <p className="info__stats__owner">
                {listing && listing?.secondsUntilEnd > 0
                  ? `Sale ends in ${
                      (listing?.secondsUntilEnd / 3600).toFixed(2) > 24
                        ? parseInt(listing?.secondsUntilEnd / 86400) + ' days'
                        : (listing?.secondsUntilEnd / 3600).toFixed(2) +
                          ' hours'
                    }`
                  : `Sale has ended`}
              </p>
            </div>

            <Box
              styles={{ marginBottom: '1rem' }}
              top={<div className="info__sale">Buy this item.</div>}
            >
              <div className="info__price">
                <h4>Current price</h4>
                <p className="info__price__amount">
                  <span>
                    <Image src="/matic.svg" alt="bnb" height={24} width={24} />
                  </span>
                  {listing?.buyoutCurrencyValuePerToken?.displayValue}
                </p>
                <h4>Quantity</h4>
                <p className="info__price__amount">
                  <BsStack size={18} />
                  {maxQuantity}
                </p>
                {listing?.secondsUntilEnd > 0 && (
                  <div
                    className="actions"
                    style={{
                      opacity: buyInProgress ? 0.5 : 1,
                      pointerEvents: buyInProgress ? 'none' : 'all',
                    }}
                  >
                    {addr ? (
                      <>
                        {addr.toString().toLowerCase() ===
                        listing?.sellerAddress.toString().toLowerCase() ? (
                          <Button primary onClick={() => unlistItem()}>
                            <MdAccountBalanceWallet /> Unlist Item
                          </Button>
                        ) : (
                          <Button primary onClick={() => buyItem()}>
                            <MdAccountBalanceWallet /> Buy now
                          </Button>
                        )}
                      </>
                    ) : (
                      <Button primary onClick={() => buyItem()}>
                        <MdAccountBalanceWallet /> Buy now
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </Box>
            <Accordion
              title="Description"
              icon={<BsTextLeft size={20} />}
              collapsed
            >
              {listing?.asset?.description || 'No description available.'}
            </Accordion>
            <div className="attributes">
              <Accordion title="Stats" icon={<MdInfoOutline size={20} />}>
                <div className="attr-list">
                  {listing?.asset?.properties?.map((prop, i) => (
                    <div className="attr" key={i}>
                      <h4>{prop?.type}</h4>
                      <p>{prop?.name}</p>
                    </div>
                  ))}
                </div>
              </Accordion>
            </div>
          </Right>
        </AssetFlex>
        {buyModal && (
          <Modal onClose={onClose}>
            <div
              className="buy-modal"
              style={{
                cursor: buyInProgress ? 'wait' : 'auto',
              }}
            >
              <h2>Buy Item (ID: {asset})</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  buyItem();
                }}
                style={{
                  opacity: buyInProgress ? 0.5 : 1,
                  pointerEvents: buyInProgress ? 'none' : 'all',
                }}
              >
                <label>
                  <h3>Quantity (Max: {maxQuantity})</h3>
                  <input
                    type="number"
                    placeholder="Quantity"
                    min={1}
                    max={maxQuantity}
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </label>
                <Button type="submit" primary>
                  Buy
                </Button>
              </form>
            </div>
          </Modal>
        )}
      </StyledAsset>
    </>
  );
}

const StyledAsset = styled.div`
  max-width: 1366px;
  margin: 0 auto;
  padding: 2rem 2rem 6rem;
  transition: all 0.3s ease;
  color: ${colors.secondary};
  .flex-2 {
    @media (max-width: 1366px) {
      flex-direction: column;
    }
  }
  .hearts {
    padding: 0.8rem 1.2rem;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    font-size: 0.8rem;
    font-weight: 600;
    color: #707a83;
    svg {
      margin-right: 0.5rem;
    }
  }
  .actions {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .info {
    &__user {
      margin: 1rem 0;
      a {
        color: #2081e2;
        font-size: 1rem;
        font-weight: 600;
      }
    }
    &__title {
      font-size: 2rem;
      font-weight: 700;
      color: ${colors.primary};
    }
    &__stats {
      margin: 1rem 0 1.5rem;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      font-size: 0.9rem;
      color: ${colors.secondary};
      &__owner {
        margin-right: 1rem;
        a {
          color: ${colors.secondary};
        }
      }
      &__views {
        display: flex;
        align-items: center;
        svg {
          margin-right: 0.5rem;
        }
      }
    }
    &__sale {
      padding: 0.8rem 1.2rem;
      display: flex;
      align-items: center;
      color: ${colors.primary};
      font-size: 0.9rem;
      font-weight: 600;
      svg {
        margin-right: 0.5rem;
      }
    }
    &__price {
      &__chart {
      }
      padding: 0 1.2rem 1.2rem;
      button {
        display: flex;
        justify-content: center;
        align-items: center;
        svg {
          margin-right: 0.5rem;
        }
      }
      h4 {
        font-size: 0.9rem;
        font-weight: 400;
        color: ${colors.tertiary};
      }
      &__amount {
        font-size: 2rem;
        font-weight: 700;
        margin: 0.5rem 0;
        color: ${colors.secondary};
        svg,
        div {
          display: inline-block;
          margin-right: 0.5rem;
        }
        span {
          font-weight: 600;
          color: ${colors.secondary};
          font-size: 0.9rem;
          margin-right: 0.5rem;
        }
      }
    }
  }
  .attributes {
    margin-top: 1rem;
    .attr-list {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;
      @media (max-width: 500px) {
        justify-content: center;
      }
    }
    .attr {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background: ${colors.primary};
      padding: 1rem;
      border-radius: 0.5rem;
      min-width: 100px;
      flex: 1;
      max-width: 150px;
      h4 {
        font-size: 1rem;
        color: #ffffff;
      }
      p {
        font-size: 0.9rem;
        margin-top: 0.25rem;
        color: #ffffff;
      }
    }
  }
  .buy-modal {
    h2 {
      color: ${colors.secondary};
    }
    form {
      margin: 1rem 0 0;
      button {
        margin: 1rem 0 0;
      }
    }
    label {
      h3 {
        font-size: 1rem;
        font-weight: 400;
        margin-bottom: 0.5rem;
        margin-left: 0.25rem;
      }
    }
  }
`;

const AssetFlex = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  gap: 1.5rem;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Left = styled.div`
  flex: 1;
  width: 100%;
  img {
    width: 100%;
    object-fit: contain;
  }
  .asset-image {
    border-radius: 1rem;
    overflow: hidden;
  }
`;

const Right = styled.div`
  width: 100%;
  flex: 1.2;
  @media (max-width: 1024px) {
    flex: 1;
  }
  display: flex;
  flex-direction: column;
`;
