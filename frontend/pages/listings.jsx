import Head from "next/head";
import styled, { keyframes } from "styled-components";
import Item from "../components/Item";
import { useContext, useEffect, useState } from "react";
import ItemSkeleton from "../components/Skeletons/ItemSkeleton";
import Modal from "../components/Modal";
import Button from "../components/Button";
import { colors } from "../styles/colors";
import { MdSync } from "react-icons/md";
import SearchBar from "../components/SearchBar";
import { ContractContext, GlobalContext } from "../context";

export async function getServerSideProps(context) {
  try {
    let protocol = "https";
    if (process.env.NODE_ENV === "development") {
      protocol = "http";
    }

    const host = context.req.headers.host;

    const res = await fetch(`${protocol}://${host}/api/cache?page=listings`);
    const data = await res.json();

    const cacheData = JSON.parse(data?.data);

    return {
      props: {
        cacheData: data ? cacheData : null,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      props: {
        cacheData: null,
      },
    };
  }
}

export default function Listings({ cacheData }) {
  const { isLoading, globalStateChanged } = useContext(GlobalContext);
  const { listings, getActiveListings } = useContext(ContractContext);

  const [filterItems, setFilterItems] = useState(null);

  const [filterModal, setFilterModal] = useState(false);

  const [lowestPrice, setLowestPrice] = useState("");
  const [highestPrice, setHighestPrice] = useState("");
  const [filterType, setFilterType] = useState("");
  const [sportsType, setSportsType] = useState("");

  useEffect(() => {
    getActiveListings();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globalStateChanged]);

  const filter = (low, high, type, sport) => {
    if (!low) {
      low = 0;
    }
    if (!high) {
      high = 100000000;
    }
    if (type) {
      if (sport) {
        setFilterItems(
          listings.filter(
            (i) =>
              parseFloat(i?.buyoutCurrencyValuePerToken?.displayValue) <=
              high &&
              parseFloat(i?.buyoutCurrencyValuePerToken?.displayValue) >= low &&
              i?.asset?.properties?.some(
                (p) => p?.name?.toLowerCase() === type
              ) &&
              i?.asset?.properties?.some(
                (p) => p?.name?.toLowerCase() === sport
              )
          )
        );
      } else {
        setFilterItems(
          listings.filter(
            (i) =>
              parseFloat(i?.buyoutCurrencyValuePerToken?.displayValue) <=
              high &&
              parseFloat(i?.buyoutCurrencyValuePerToken?.displayValue) >= low &&
              i?.asset?.properties?.some((p) => p?.name?.toLowerCase() === type)
          )
        );
      }
    } else {
      if (sport) {
        setFilterItems(
          listings.filter(
            (i) =>
              parseFloat(i?.buyoutCurrencyValuePerToken?.displayValue) <=
              high &&
              parseFloat(i?.buyoutCurrencyValuePerToken?.displayValue) >= low &&
              i?.asset?.properties?.some(
                (p) => p?.name?.toLowerCase() === sport
              )
          )
        );
      } else {
        setFilterItems(
          listings.filter(
            (i) =>
              parseFloat(i?.buyoutCurrencyValuePerToken?.displayValue) <=
              high &&
              parseFloat(i?.buyoutCurrencyValuePerToken?.displayValue) >= low
          )
        );
      }
    }
  };

  return (
    <>
      <Head>
        <title>Fantasy Sports Marketplace</title>
        <meta name="description" content="Fantasy Sports" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <StyledMain>
        <div className="content">
          <SearchBar />
          <h1>Active Listings</h1>
          <div className="result">
            <h3 className="title">
              {listings.length} listings
              {isLoading && <MdSync title="Revalidating Data..." />}
            </h3>
            <button onClick={() => setFilterModal(true)}>Filter</button>
          </div>

          <div className="players">
            {filterItems ? (
              <>
                {filterItems.length > 0
                  ? filterItems.map((item, i) => {
                    return (
                      <Item
                        key={i}
                        to={`/${item?.type === 0 ? "asset" : "auction"}/${item?.id
                          }`}
                        title={item?.asset?.name}
                        price={
                          item?.buyoutCurrencyValuePerToken?.displayValue
                        }
                        image={item?.asset?.image || "/logo.png"}
                        type="Buy Now"
                      />
                    );
                  })
                  : "No active listings found"}
              </>
            ) : (
              <>
                {listings.length > 0 ? (
                  listings.map((item, i) => {
                    return (
                      <Item
                        key={i}
                        to={`/${item?.type === 0 ? "asset" : "auction"}/${item?.id
                          }`}
                        title={item?.asset?.name}
                        price={item?.buyoutCurrencyValuePerToken?.displayValue}
                        image={item?.asset?.image || "/logo.png"}
                        type="Buy Now"
                      />
                    );
                  })
                ) : isLoading ? (
                  <>
                    <ItemSkeleton />
                    <ItemSkeleton />
                    <ItemSkeleton />
                    <ItemSkeleton />
                  </>
                ) : (
                  "No listings found"
                )}
              </>
            )}
          </div>
        </div>
        {filterModal && (
          <Modal onClose={() => setFilterModal(false)}>
            <div className="filter">
              <h3>Filter</h3>
              <div className="rarity">
                <p>Filter by sports</p>
                <div className="rarity-flex">
                  <button
                    className={sportsType === "baseball" ? "active" : undefined}
                    onClick={() => setSportsType("baseball")}
                  >
                    Baseball
                  </button>
                  <button
                    className={sportsType === "football" ? "active" : undefined}
                    onClick={() => setSportsType("football")}
                  >
                    Football
                  </button>
                  <button
                    className={
                      sportsType === "basketball" ? "active" : undefined
                    }
                    onClick={() => setSportsType("basketball")}
                  >
                    Basketball
                  </button>
                </div>
              </div>
              <div className="rarity">
                <p>Filter by rarity</p>
                <div className="rarity-flex">
                  <button
                    className={filterType === "diamond" ? "active" : undefined}
                    onClick={() => setFilterType("diamond")}
                  >
                    Diamond
                  </button>
                  <button
                    className={filterType === "platinum" ? "active" : undefined}
                    onClick={() => setFilterType("platinum")}
                  >
                    Platinum
                  </button>
                  <button
                    className={filterType === "gold" ? "active" : undefined}
                    onClick={() => setFilterType("gold")}
                  >
                    Gold
                  </button>
                  <button
                    className={filterType === "silver" ? "active" : undefined}
                    onClick={() => setFilterType("silver")}
                  >
                    Silver
                  </button>
                  <button
                    className={filterType === "bronze" ? "active" : undefined}
                    onClick={() => setFilterType("bronze")}
                  >
                    Bronze
                  </button>
                </div>
              </div>
              <div className="price">
                <p>Filter by price</p>
                <div>
                  <input
                    type="number"
                    placeholder="Min Price"
                    value={lowestPrice}
                    onChange={(e) => setLowestPrice(e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="Max Price"
                    value={highestPrice}
                    onChange={(e) => setHighestPrice(e.target.value)}
                  />
                </div>
              </div>
              <Button
                primary
                className="submit"
                onClick={() => {
                  filter(lowestPrice, highestPrice, filterType, sportsType);
                  setFilterModal(false);
                }}
              >
                Filter
              </Button>
              <Button
                className="clear"
                onClick={() => {
                  setFilterItems(null);
                  setFilterModal(false);
                  setFilterType(null);
                  setSportsType(null);
                }}
              >
                Clear
              </Button>
            </div>
          </Modal>
        )}
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
    font-weight: bold;
  }
  .search-bar {
    margin-bottom: 1rem;
    min-width: 100%;
    @media (min-width: 801px) {
      display: none;
    }
  }
  .result {
    display: flex;
    align-items: center;
    margin-top: 2rem;
    button {
      background: transparent;
      margin-left: 1rem;
      font-size: 0.9rem;
      font-weight: 300;
      border: 1px solid ${colors.secondary};
      color: ${colors.secondary};
      padding: 0.25rem 1rem;
      border-radius: 0.25rem;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s ease;
      &:hover {
        background: ${colors.secondary};
        color: ${colors.background};
      }
    }
  }
  .filter {
    h3 {
      margin-bottom: 1rem;
      font-size: 1.2rem;
      color: ${colors.primary};
    }
    p {
      font-weight: 300;
      font-size: 1rem;
    }

    .submit {
      width: 100%;
      margin-top: 1.5rem;
    }
    .clear {
      width: 100%;
      margin-top: 0.5rem;
    }
    .rarity {
      margin-bottom: 1rem;
      &-flex {
        width: 100%;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 0.5rem;
      }
      p {
        margin-bottom: 0.5rem;
        color: ${colors.primary};
        font-weight: 600;
      }
      button {
        background: transparent;
        font-size: 0.9rem;
        font-weight: 300;
        border: 1px solid ${colors.secondary};
        color: ${colors.secondary};
        padding: 0.25rem 1rem;
        border-radius: 0.25rem;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.3s ease;
        &:hover {
          background: ${colors.secondary};
          color: ${colors.background};
        }
      }
      .active {
        background: ${colors.secondary};
        color: ${colors.background};
      }
    }
    .price {
      margin-top: 1rem;
      p {
        margin-bottom: 0.5rem;
        color: ${colors.primary};
        font-weight: 600;
      }
      div {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        input {
          font-size: 0.9rem;
        }
      }
    }
  }
  .content {
    position: relative;
    z-index: 2;
    .title {
      color: ${colors.secondary};
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
      box-shadow: 0 20px 25px -5px rgba(${colors.tertiaryRGB}, 0.1),
        0 10px 10px -5px rgba(${colors.tertiaryRGB}, 0.04);
      transition: all 0.3s ease;
      &:hover {
        box-shadow: 0 20px 25px -5px rgba(${colors.tertiaryRGB}, 0.1),
          0 10px 10px -5px rgba(${colors.tertiaryRGB}, 0.04);
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
