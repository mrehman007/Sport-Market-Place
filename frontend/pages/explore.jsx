import Head from 'next/head';
import styled, { keyframes } from 'styled-components';
import Item from '../components/Item';
import { v4 as uuid } from 'uuid';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { config } from '../config';
import { useContext, useEffect, useState } from 'react';
import { providers } from 'ethers';
import ItemSkeleton from '../components/Skeletons/ItemSkeleton';
import { hasListingExpired } from '../utils';
import { colors } from '../styles/colors';
import { MdSync } from 'react-icons/md';
import SearchBar from '../components/SearchBar';
import { GlobalContext } from '../context';

export async function getServerSideProps(context) {
  try {
    let protocol = 'https';
    if (process.env.NODE_ENV === 'development') {
      protocol = 'http';
    }

    const host = context.req.headers.host;

    const res = await fetch(`${protocol}://${host}/api/cache?page=index`);
    const data = await res.json();

    const cacheData = JSON.parse(data?.data);

    return {
      props: {
        cacheData: data ? cacheData : null,
      },
    };
  } catch (error) {
    return {
      props: {
        cacheData: null,
      },
    };
  }
}

export default function Explore({ cacheData }) {
  const { address } = useContext(GlobalContext);

  const [items, setItems] = useState(cacheData || []);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const market = async () => {
      // setLoading(true);
      let provider;
      if (address) {
        provider = new providers.Web3Provider(window.ethereum).getSigner();
      } else {
        provider = new providers.JsonRpcProvider(config.FALLBACK_RPC_URL);
      }
      try {
        const sdk = new ThirdwebSDK(provider);
        const marketplace = sdk.getMarketplace(config.MARKETPLACE_ADDRESS);
        let listings = await marketplace.getActiveListings();
        listings = listings.filter((l) => {
          let secondsUntilEnd =
            l?.type === 0
              ? l?.secondsUntilEnd
              : l?.endTimeInEpochSeconds - Math.floor(Date.now() / 1000);
          return (
            hasListingExpired(secondsUntilEnd) && l?.quantity.toNumber() > 0
            // Array.isArray(l?.asset?.properties)
          );
        });

        setItems(listings);
        // setListings(listings)
        setLoading(false);
        // await fetch('/api/cache', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify({
        //     page: 'index',
        //     data: listings || [],
        //   }),
        // });
      } catch (err) {
        console.log(err);
      }
    };
    market();
  }, [address]);

  return (
    <>
      <Head>
        <title>Fantasy Sports</title>
        <meta name="description" content="Fantasy Sports" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <StyledMain>
        <div className="content">
          <SearchBar />
          <h1>Browse Trending Players</h1>
          <h3 className="title">
            Latest Items{loading && <MdSync title="Revalidating Data..." />}
          </h3>
          <div className="players">
            {items.length > 0 ? (
              items.map((item) => {
                return (
                  <Item
                    key={uuid()}
                    to={`/${item?.type === 0 ? 'asset' : 'auction'}/${item?.id
                      }`}
                    title={item?.asset?.name}
                    price={item?.buyoutCurrencyValuePerToken?.displayValue}
                    image={item?.asset?.image || '/logo.png'}
                    type={item?.type === 0 ? 'Buy Now' : 'Auction'}
                  />
                );
              })
            ) : loading ? (
              <>
                <ItemSkeleton />
                <ItemSkeleton />
                <ItemSkeleton />
                <ItemSkeleton />
              </>
            ) : (
              'No items found'
            )}
          </div>
        </div>
      </StyledMain>
    </>
  );
}

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(-360deg);
  }
`;

const StyledMain = styled.div`
  padding: 2rem 2rem 6rem;
  min-height: 100vh;
  position: relative;
  h1 {
    color: ${colors.primary};
  }
  .search-bar {
    margin-bottom: 1rem;
    min-width: 100%;
    @media (min-width: 801px) {
      display: none;
    }
  }
  .content {
    position: relative;
    z-index: 2;
    .title {
      margin-top: 2rem;
      color: ${colors.secondary};
      display: flex;
      align-items: center;
      line-height: 1;
      svg {
        margin-left: 1rem;
        animation: ${spin} 2s linear infinite;
      }
    }
    .chart {
      position: relative;
      color: #fff;
      z-index: 99;
      height: 200px;
      padding: 1rem 0;
      margin: 1rem 0 2rem;
      border-radius: 0.5rem;
      background-color: #202442;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
        0 10px 10px -5px rgba(0, 0, 0, 0.04);
      transition: all 0.3s ease;
      &:hover {
        box-shadow: 0 20px 25px -5px rgba(199, 64, 121, 0.1),
          0 10px 10px -5px rgba(199, 64, 121, 0.04);
      }
    }
    .stats {
      margin-top: 1.5rem;
      display: grid;
      gap: 1rem;
      grid-template-columns: repeat(3, 1fr);
      @media (max-width: 1024px) {
        grid-template-columns: repeat(2, 1fr);
      }
      @media (max-width: 768px) {
        grid-template-columns: repeat(1, 1fr);
      }
    }
    .players {
      margin-top: 1.5rem;
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      @media (max-width: 1366px) {
        grid-template-columns: repeat(5, 1fr);
      }
      @media (max-width: 1024px) {
        grid-template-columns: repeat(3, 1fr);
      }
      @media (max-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
      }
      @media (max-width: 400px) {
        grid-template-columns: repeat(1, 1fr);
      }
      gap: 1rem;
    }
  }
`;
