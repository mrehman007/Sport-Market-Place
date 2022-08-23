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

import Item from '../../components/Item';
import { hasListingExpired } from '../../utils';
import { colors } from '../../styles/colors';
import { GlobalContext } from '../../context';

export default function View() {
  const { address } = useContext(GlobalContext);
  const router = useRouter();
  const { view } = router.query;

  const [itemData, setItemData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [loadingListing, setLoadingListing] = useState(true);
  const [listingData, setListingData] = useState([]);

  const [sellModal, setSellModal] = useState(false);
  const [auctionModal, setAuctionModal] = useState(false);
  const [sellInProgress, setSellInProgress] = useState(false);

  const [maxQuantity, setMaxQuantity] = useState(1);
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0);
  const [reservePrice, setReservePrice] = useState(0);
  const [endDate, setEndDate] = useState('2023-01-01T00:00');
  const [endSeconds, setEndSeconds] = useState(
    parseInt((new Date('2023-01-01T00:00').getTime() - Date.now()) / 1000)
  );

  const onClose = () => {
    setSellModal(false);
    setAuctionModal(false);
  };

  useEffect(() => {
    const getView = async () => {
      setLoading(true);
      let provider = new ethers.providers.Web3Provider(
        window.ethereum
      ).getSigner();
      try {
        const sdk = new ThirdwebSDK(provider);
        const nftCollection = sdk.getNFTCollection(config.PLAYER_NFT_ADDRESS);
        const item = await nftCollection.get(view);
        const amount = await nftCollection.balanceOf(address, view);
        const marketplace = sdk.getMarketplace(config.MARKETPLACE_ADDRESS);
        const listing = await marketplace.getActiveListings({
          tokenId: view,
          seller: address,
          tokenContract: config.PLAYER_NFT_ADDRESS,
        });
        let listedQuantity = 0;
        const filteredListing = listing.filter((listing) => {
          if (listing?.secondsUntilEnd > 0) {
            listedQuantity += listing?.quantity.toNumber();
          }
          return listing?.quantity.toNumber() > 0;
        });
        let remainingSupply = amount.toNumber() - listedQuantity;
        setItemData({
          ...item,
          supply: remainingSupply,
        });
        setLoading(false);
        setMaxQuantity(remainingSupply);

        setListingData(filteredListing);

        setLoadingListing(false);
      } catch (err) {
        console.log(err);
      }
    };
    view && getView();
  }, [address, view]);

  const sellItem = async () => {
    if (price <= 0) {
      toast.error('Please enter a valid price');
      return;
    }
    toast.promise(
      new Promise(async (resolve, reject) => {
        setSellInProgress(true);
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const sdk = new ThirdwebSDK(provider.getSigner());
          const marketplace = sdk.getMarketplace(config.MARKETPLACE_ADDRESS);
          let data = await marketplace.direct.createListing({
            assetContractAddress: config.PLAYER_NFT_ADDRESS,
            currencyContractAddress: config.CHAIN_NATIVE_TOKEN_ADDRESS,
            buyoutPricePerToken: price,
            listingDurationInSeconds: endSeconds,
            quantity: quantity,
            tokenId: parseInt(view),
            startTimestamp: new Date(),
          });
          resolve('Listing Successful!');
          setSellInProgress(false);
          router.push('/listings');
        } catch (err) {
          reject(
            `Error: ${err?.reason || err?.data?.message || err?.message || err}`
          );
          setSellInProgress(false);
        }
      }),
      {
        loading: 'Listing in progress...',
        success: (msg) => `${String(msg)}`,
        error: (msg) => `${String(msg)}`,
      }
    );
  };

  const auctionItem = async () => {
    if (price <= 0) {
      toast.error('Please enter a valid price');
      return;
    }
    toast.promise(
      new Promise(async (resolve, reject) => {
        setSellInProgress(true);
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const sdk = new ThirdwebSDK(provider.getSigner());
          const marketplace = sdk.getMarketplace(config.MARKETPLACE_ADDRESS);
          let data = await marketplace.auction.createListing({
            assetContractAddress: config.PLAYER_NFT_ADDRESS,
            currencyContractAddress: config.CHAIN_NATIVE_TOKEN_ADDRESS,
            buyoutPricePerToken: price,
            reservePricePerToken: reservePrice,
            listingDurationInSeconds: endSeconds,
            quantity: quantity,
            tokenId: parseInt(view),
            startTimestamp: new Date(),
          });
          resolve('Auction started!');
          setSellInProgress(false);
          router.push('/auctions');
        } catch (err) {
          reject(
            `Error: ${err?.reason || err?.data?.message || err?.message || err}`
          );
          setSellInProgress(false);
        }
      }),
      {
        loading: 'Starting auction...',
        success: (msg) => `${String(msg)}`,
        error: (msg) => `${String(msg)}`,
      }
    );
  };

  return (
    <>
      <Head>
        <title>
          {itemData?.metadata?.name || view} - NFT | Fantasy NFT Marketplace
        </title>
      </Head>
      {loading && <BoxSkeleton />}
      <StyledView>
        <ViewFlex>
          <Left>
            <div className="asset-image">
              <Image
                src={
                  itemData?.metadata?.image
                    ? itemData?.metadata?.image
                    : '/logo.png'
                }
                alt={itemData?.metadata?.name}
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
            <p
              className="info__title"
              style={{
                marginBottom: '1rem',
              }}
            >
              {itemData?.metadata?.name}
            </p>
            <Box
              styles={{ marginBottom: '1rem' }}
              top={<div className="info__sale">Item info</div>}
            >
              <div className="info__price">
                <h4>Available amount</h4>
                <p className="info__price__amount">
                  <BsStack size={18} />
                  {maxQuantity}
                </p>
                <div className="actions">
                  {!loadingListing && maxQuantity > 0 ? (
                    <>
                      <Button primary onClick={() => setSellModal(true)}>
                        <MdAccountBalanceWallet /> Fixed Price
                      </Button>
                      <Button primary onClick={() => setAuctionModal(true)}>
                        <MdAccountBalanceWallet /> Timed Auction
                      </Button>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </Box>
            <Accordion
              title="Current Listings"
              icon={<BsTextLeft size={20} />}
              collapsed
              styles={{
                marginBottom: '1rem',
              }}
            >
              <div className="listings">
                <div className="listings__wrapper">
                  {listingData.length > 0
                    ? listingData.map((listing, i) => {
                      return (
                        <div
                          className={
                            hasListingExpired(listing?.secondsUntilEnd)
                              ? undefined
                              : 'warn'
                          }
                          key={i}
                        >
                          <Item
                            to={`/${listing?.type === 0 ? 'asset' : 'auction'
                              }/${listing?.id}`}
                            price={
                              listing?.buyoutCurrencyValuePerToken
                                ?.displayValue
                            }
                            image={listing?.asset?.image || '/logo.png'}
                            type={listing?.type === 0 ? 'Buy Now' : 'Auction'}
                          />
                        </div>
                      );
                    })
                    : loadingListing
                      ? 'Loading...'
                      : 'No listings found'}
                </div>
              </div>
            </Accordion>
            <Accordion
              title="Description"
              icon={<BsTextLeft size={20} />}
              collapsed
            >
              {itemData?.metadata?.description || 'No description available.'}
            </Accordion>

            <div className="attributes">
              <Accordion title="Stats" icon={<MdInfoOutline size={20} />}>
                <div className="attr-list">
                  {(
                    itemData?.metadata?.properties ||
                    itemData?.metadata?.attributes ||
                    []
                  ).map((attribute, i) => {
                    return (
                      <div className="attr" key={i}>
                        <h4>{attribute?.trait_type}</h4>
                        <p>{attribute?.value}</p>
                      </div>
                    );
                  })}
                </div>
              </Accordion>
            </div>
          </Right>
        </ViewFlex>

        {sellModal && (
          <Modal onClose={onClose}>
            <div
              className="sell-modal"
              style={{
                cursor: sellInProgress ? 'wait' : 'auto',
              }}
            >
              <h2>Sell Item (ID: {view})</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sellItem();
                }}
                style={{
                  opacity: sellInProgress ? 0.5 : 1,
                  pointerEvents: sellInProgress ? 'none' : 'all',
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
                <label>
                  <h3>Price per token</h3>
                  <input
                    type="number"
                    placeholder="Quantity"
                    min={0}
                    step={0.00001}
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </label>
                <label>
                  <h3>Listing will stay up until</h3>
                  <input
                    type="datetime-local"
                    placeholder="Date and Time"
                    required
                    value={endDate}
                    onChange={(e) => {
                      if (
                        parseInt(
                          (new Date(e.target.value).getTime() - Date.now()) /
                          1000
                        ) > 0
                      ) {
                        setEndSeconds(
                          parseInt(
                            (new Date(e.target.value).getTime() - Date.now()) /
                            1000
                          )
                        );
                      } else {
                        toast.error('End date must be in the future!');
                      }
                      setEndDate(e.target.value);
                    }}
                  />
                </label>
                <Button type="submit" primary>
                  Sell
                </Button>
              </form>
            </div>
          </Modal>
        )}
        {auctionModal && (
          <Modal onClose={onClose}>
            <div
              className="sell-modal"
              style={{
                cursor: sellInProgress ? 'wait' : 'auto',
              }}
            >
              <h2>Auction Item (ID: {view})</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  auctionItem();
                }}
                style={{
                  opacity: sellInProgress ? 0.5 : 1,
                  pointerEvents: sellInProgress ? 'none' : 'all',
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
                <label>
                  <h3>Buyout price per token</h3>
                  <input
                    type="number"
                    placeholder="Quantity"
                    min={0}
                    step={0.00001}
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </label>
                <label>
                  <h3>Reserve price per token</h3>
                  <input
                    type="number"
                    placeholder="Quantity"
                    min={0}
                    step={0.00001}
                    required
                    value={reservePrice}
                    onChange={(e) => setReservePrice(e.target.value)}
                  />
                </label>
                <label>
                  <h3>Auction will end on</h3>
                  <input
                    type="datetime-local"
                    placeholder="Date and Time"
                    required
                    value={endDate}
                    onChange={(e) => {
                      if (
                        parseInt(
                          (new Date(e.target.value).getTime() - Date.now()) /
                          1000
                        ) > 0
                      ) {
                        setEndSeconds(
                          parseInt(
                            (new Date(e.target.value).getTime() - Date.now()) /
                            1000
                          )
                        );
                      } else {
                        toast.error('End date must be in the future!');
                      }
                      setEndDate(e.target.value);
                    }}
                  />
                </label>
                <Button type="submit" primary>
                  Auction
                </Button>
              </form>
            </div>
          </Modal>
        )}
      </StyledView>
    </>
  );
}

const StyledView = styled.div`
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

  .listings {
    overflow-x: auto;
    &__wrapper {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      @media (max-width: 1366px) {
        grid-template-columns: repeat(3, 1fr);
      }
      @media (max-width: 1024px) {
        grid-template-columns: repeat(2, 1fr);
      }
      @media (max-width: 425px) {
        grid-template-columns: repeat(1, 1fr);
      }
      gap: 1rem;
    }
    .warn {
      border: 1px solid ${colors.primary};
      border-radius: 0.5rem;
      overflow: hidden;
      position: relative;
      transition: all 0.3s ease;
      &::after {
        content: 'Expired';
        position: absolute;
        top: 0;
        left: 0;
        color: #fff;
        font-size: 0.8rem;
        font-weight: 600;
        padding: 0.5rem;
        background: ${colors.primary};
        border-radius: 0 0 0.5rem 0;
      }
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
  .sell-modal {
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
      display: block;
      &:not(:first-child) {
        margin-top: 0.5rem;
      }
      h3 {
        font-size: 1rem;
        font-weight: 400;
        margin-bottom: 0.5rem;
        margin-left: 0.25rem;
      }
    }
  }
`;

const ViewFlex = styled.div`
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
