import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import {
  MdAccountBalanceWallet,
  MdExpandMore,
  MdInfoOutline,
} from 'react-icons/md';
import { BsTextLeft, BsStack } from 'react-icons/bs';
import { FaEthereum } from 'react-icons/fa';
import Box from '../../components/Box';
import Button from '../../components/Button';
import Accordion from '../../components/Accordion';

import { shimmer, toBase64 } from '../../utils/placeholder';

import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { config } from '../../config';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import BoxSkeleton from '../../components/Skeletons/BoxSkeleton';
import Modal from '../../components/Modal';
import { colors } from '../../styles/colors';

import { toast } from 'react-toastify';

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

export default function Auction({ path, cacheData }) {
  const router = useRouter();
  const { auction } = router.query;

  const addr = useSelector((state) => state.auth.addr);

  const [itemData, setItemData] = useState(cacheData || null);
  const [loading, setLoading] = useState(false);

  const [bidModal, setBidModal] = useState(false);
  const [buyInProgress, setBuyInProgress] = useState(false);
  const [bidInProgress, setBidInProgress] = useState(false);

  const [count, setCount] = useState(0);

  const [tokenPrice, setTokenPrice] = useState(0);

  const [winningBid, setWinningBid] = useState(null);
  const [loadingBid, setLoadingBid] = useState(true);

  const [remainingSeconds, setRemainingSeconds] = useState(1);

  const onClose = () => setBidModal(false);

  useEffect(() => {
    const getAsset = async () => {
      if (!cacheData) {
        setLoading(true);
      } else {
        setCount(parseInt(cacheData?.quantity?.hex, 16));
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
        const listing = await marketplace.getListing(auction);
        setItemData(listing);
        setTokenPrice(listing?.reservePriceCurrencyValuePerToken?.displayValue);
        setRemainingSeconds(
          listing?.endTimeInEpochSeconds.toNumber() -
            Math.floor(Date.now() / 1000)
        );
        setCount(listing?.quantity.toNumber());
        setLoading(false);
        let winningBid = await marketplace.auction.getWinningBid(auction);
        setWinningBid(winningBid);
        setLoadingBid(false);
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
  }, [auction, addr, cacheData, path]);

  const cancelAuction = async () => {
    toast.promise(
      new Promise(async (resolve, reject) => {
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
          setBuyInProgress(true);
          const sdk = new ThirdwebSDK(provider);
          const marketplace = sdk.getMarketplace(config.MARKETPLACE_ADDRESS);
          await marketplace.auction.cancelListing(auction);
          resolve('Auction cancelled!');
        } catch (err) {
          setBuyInProgress(false);
          console.log(err);
          reject(err?.message || err);
        }
      }),
      {
        loading: 'Cancelling auction...',
        success: (data) => `${String(data)}`,
        error: (data) => `${String(data)}`,
      }
    );
  };

  const closeAuction = async () => {
    toast.promise(
      new Promise(async (resolve, reject) => {
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
          setBuyInProgress(true);
          const sdk = new ThirdwebSDK(provider);
          const marketplace = sdk.getMarketplace(config.MARKETPLACE_ADDRESS);
          await marketplace.auction.closeListing(auction);
          resolve('Auction closed!');
          router.push('/profile');
        } catch (err) {
          setBuyInProgress(false);
          console.log(err);
          reject(err?.data?.message || err?.message || err);
        }
      }),
      {
        loading: 'Closing auction...',
        success: (data) => `${String(data)}`,
        error: (data) => `${String(data)}`,
      }
    );
  };

  const bid = async () => {
    toast.promise(
      new Promise(async (resolve, reject) => {
        setBidInProgress(true);
        if (!window.ethereum || !addr) {
          reject('Please connect a wallet!');
          setBidInProgress(false);
          return null;
        }
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        try {
          const sdk = new ThirdwebSDK(provider.getSigner());
          const marketplace = sdk.getMarketplace(config.MARKETPLACE_ADDRESS);
          const pricePerToken = tokenPrice;
          let data = await marketplace.auction.makeBid(auction, pricePerToken);

          setBidInProgress(false);
          resolve('Successful!');
          setBidModal(false);
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } catch (err) {
          console.log(err);
          reject(err?.data?.message || err?.message || err);
          setBidInProgress(false);
        }
      }),
      {
        loading: 'Bidding...',
        success: (data) => `${String(data)}`,
        error: (data) => `${String(data)}`,
      }
    );
  };

  return (
    <>
      <Head>
        <title>
          {itemData?.asset?.name || auction} - Auction | Fantasy NFT Marketplace
        </title>
      </Head>
      {loading && <BoxSkeleton />}
      <StyledAuction>
        <AuctionFlex>
          <Left>
            <div className="asset-image">
              <Image
                src={
                  itemData?.asset?.image ? itemData?.asset?.image : '/logo.png'
                }
                alt={itemData?.asset?.name}
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
            {/* <div className="info__user">ID: {asset}</div> */}
            <p className="info__title">{itemData?.asset?.name}</p>

            <div className="info__stats">
              <p className="info__stats__owner">
                {remainingSeconds > 0
                  ? `Auction ends in ${
                      (remainingSeconds / 3600).toFixed(2) > 24
                        ? parseInt(remainingSeconds / 86400) + ' days'
                        : (remainingSeconds / 3600).toFixed(2) + ' hours'
                    }`
                  : 'Auction has ended'}
              </p>
            </div>

            <Box
              styles={{ marginBottom: '1rem' }}
              top={<div className="info__sale">Buy this item.</div>}
            >
              <div className="info__price">
                <div className="price__flex">
                  <div>
                    <h4>Buyout price per token</h4>
                    <p className="info__price__amount">
                      {/* <FaEthereum size={18} /> */}
                      <span>
                        <Image
                          src="/matic.svg"
                          alt="bnb"
                          height={24}
                          width={24}
                        />
                      </span>
                      {itemData?.buyoutCurrencyValuePerToken?.displayValue}
                    </p>
                  </div>
                  <div>
                    <h4>Reserve price per token</h4>
                    <p className="info__price__amount">
                      {/* <FaEthereum size={18} /> */}
                      <span>
                        <Image
                          src="/matic.svg"
                          alt="bnb"
                          height={24}
                          width={24}
                        />
                      </span>
                      {
                        itemData?.reservePriceCurrencyValuePerToken
                          ?.displayValue
                      }
                    </p>
                  </div>
                </div>
                <h4>Quantity</h4>
                <p className="info__price__amount">
                  <BsStack size={18} />
                  {count}
                </p>
                <div className="actions">
                  {/* <Button
                    primary
                    onClick={() => buyItem()}
                    style={{
                      opacity: buyInProgress ? 0.5 : 1,
                      pointerEvents: buyInProgress ? "none" : "auto",
                    }}
                  >
                    <MdAccountBalanceWallet /> Buyout
                  </Button> */}

                  {addr ? (
                    <>
                      {addr.toString().toLowerCase() ===
                      itemData?.sellerAddress.toString().toLowerCase() ? (
                        <>
                          <Button primary onClick={() => cancelAuction()}>
                            <MdAccountBalanceWallet /> Cancel auction
                          </Button>
                          {remainingSeconds < 0 && (
                            <Button primary onClick={() => closeAuction()}>
                              <MdAccountBalanceWallet /> Close auction
                            </Button>
                          )}
                        </>
                      ) : (
                        <>
                          {remainingSeconds > 0 ? (
                            <Button
                              primary
                              onClick={() => setBidModal(true)}
                              style={{
                                opacity: buyInProgress ? 0.5 : 1,
                                pointerEvents: buyInProgress ? 'none' : 'auto',
                              }}
                            >
                              <MdAccountBalanceWallet /> Bid
                            </Button>
                          ) : (
                            <>
                              {addr.toLowerCase() ===
                                winningBid?.buyerAddress?.toLowerCase() && (
                                <Button primary onClick={() => closeAuction()}>
                                  <MdAccountBalanceWallet /> Close auction
                                </Button>
                              )}
                            </>
                          )}
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      {remainingSeconds > 0 && (
                        <Button
                          primary
                          onClick={() => setBidModal(true)}
                          style={{
                            opacity: buyInProgress ? 0.5 : 1,
                            pointerEvents: buyInProgress ? 'none' : 'auto',
                          }}
                        >
                          <MdAccountBalanceWallet /> Bid
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </Box>
            {/* <Box
              styles={{ marginTop: "1rem" }}
              top={
                <div className="info__sale">
                  <MdAccessTime size={18} /> Lorem ipsum dolor sit amet.
                </div>
              }
            >
              <div className="info__price">
                <h4>
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                  Neque enim, quisquam officiis blanditiis voluptatem minima
                  minus ullam mollitia sunt commodi?
                </h4>
              </div>
            </Box> */}
            <Accordion
              title="Description"
              icon={<BsTextLeft size={20} />}
              collapsed
            >
              {itemData?.asset?.description || 'No description available.'}
            </Accordion>

            <Accordion
              title="Winning Bid"
              icon={<BsTextLeft size={20} />}
              styles={{ marginTop: '1rem' }}
              collapsed
            >
              <div className="winning">
                {winningBid ? (
                  <>
                    <div className="winning__address">
                      {winningBid?.buyerAddress.substring(0, 6)}...
                      {winningBid?.buyerAddress.slice(-4)}
                      <span>
                        <MdExpandMore size={24} />
                      </span>
                    </div>
                    <div className="winning__price">
                      <FaEthereum size={12} />{' '}
                      {winningBid?.currencyValue?.displayValue}
                    </div>
                  </>
                ) : (
                  <>
                    {loadingBid ? (
                      <div className="winning__address">Loading bids...</div>
                    ) : (
                      <div className="winning__address">No bids yet</div>
                    )}
                  </>
                )}
              </div>
            </Accordion>
            <div className="attributes">
              <Accordion title="Stats" icon={<MdInfoOutline size={20} />}>
                <div className="attr-list">
                  {itemData?.asset?.properties?.map((prop, i) => (
                    <div className="attr" key={i}>
                      <h4>{prop?.type}</h4>
                      <p>{prop?.name}</p>
                    </div>
                  ))}
                </div>
              </Accordion>
            </div>
          </Right>
        </AuctionFlex>
        {bidModal && (
          <Modal onClose={onClose}>
            <div
              className="bid-modal"
              style={{
                cursor: bidInProgress ? 'wait' : 'auto',
              }}
            >
              <h2>Bid on auction (ID: {auction})</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  bid();
                }}
                style={{
                  opacity: bidInProgress ? 0.5 : 1,
                  pointerEvents: bidInProgress ? 'none' : 'all',
                }}
              >
                <label>
                  <h3>Price per token</h3>
                  <input
                    type="number"
                    placeholder="Price per token"
                    step={0.0001}
                    min={0}
                    required
                    value={tokenPrice}
                    onChange={(e) => setTokenPrice(e.target.value)}
                  />
                </label>
                <Button type="submit" primary>
                  Bid
                </Button>
              </form>
            </div>
          </Modal>
        )}
      </StyledAuction>
    </>
  );
}

const StyledAuction = styled.div`
  max-width: 1366px;
  margin: 0 auto;
  padding: 2rem 2rem 6rem;
  transition: all 0.3s ease;
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
  .winning {
    display: flex;
    align-items: center;
    &__address {
      font-size: 1rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      span {
        display: flex;
        align-items: center;
        margin: 0 0.5rem;
        svg {
          transform: rotate(-90deg);
        }
      }
    }
    &__price {
      font-size: 1rem;
      font-weight: 600;
      color: ${colors.primary};
    }
  }
  .price__flex {
    display: flex;
    gap: 2rem;
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
      color: ${colors.secondary};
      font-size: 0.9rem;
      font-weight: 600;
      svg {
        margin-right: 0.5rem;
      }
    }
    &__price {
      &__chart {
      }
      padding: 1.2rem;
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
        color: ${colors.secondary};
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
  .bid-modal {
    h2 {
      color: ${colors.primary};
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

const AuctionFlex = styled.div`
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
