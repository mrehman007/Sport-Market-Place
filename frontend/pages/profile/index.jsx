import { useContext } from 'react';

import styled from 'styled-components';
import ScrollAnimation from 'react-animate-on-scroll';
import Item from '../../components/Item';
import { v4 as uuid } from 'uuid';
import { useEffect } from 'react';
import ItemSkeleton from '../../components/Skeletons/ItemSkeleton';
import { colors } from '../../styles/colors';
import ProfileHeading from '../../components/ProfileHeading';
import ClubBoxWidget from '../../components/ClubBoxWidget';
import Chart from '../../components/Chart';
import { ContractContext, GlobalContext } from '../../context';
import { useState } from 'react';
import { utils } from 'ethers';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { config } from '../../config';
import { toast } from 'react-toastify';
import axios from 'axios';

export default function ProfilePage() {
  const {
    isLoading,
    globalStateChanged,
    address,
    setIsLoading,
    getProviderOrSigner,
  } = useContext(GlobalContext);
  const {
    players,
    vouchers,
    votes,
    earnings,
    gameItems,
    myPacks,
    getOwned,
    getMyVotes,
    getMyGameItems,
    getMyVouchers,
    getMyPacks,
    getMyEarnings,
  } = useContext(ContractContext);
  const [balance, setBalance] = useState(0);
  const [nftsValue, setNftsValue] = useState(0);

  useEffect(() => {
    const fetchData = async (address) => {
      const provider = await getProviderOrSigner();
      const sdk = new ThirdwebSDK(provider);
      setIsLoading(true);

      setBalance(await provider.getBalance(address));

      await Promise.all([
        getOwned(sdk, address),
        getMyVouchers(sdk, address),
        getMyVotes(sdk, address),
        getMyPacks(sdk, address),
        getMyGameItems(sdk, address),
        getMyEarnings(address),
      ]);
      setIsLoading(false);
    };

    address && fetchData(address);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, globalStateChanged]);

  useEffect(() => {
    const fetchData = async () => {
      const query = `
      {
        sales (
          orderBy: timestamp,
          orderDirection: desc,
          where: {
            assetContract_contains_nocase: "0x${config.PLAYER_NFT_ADDRESS}"
          }
          ) {
          id
          listingId
          assetContract
          lister {
            id
          }
          buyer {
            id
          }
          quantityBought
          totalPricePaid
          timestamp
        }
      }
      `;
      const { data } = axios({
        url: process.env.NEXT_PUBLIC_SUBGRAPH_URL,
        method: 'POST',
        data: { query },
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });

      console.log({
        // sales,
        data,
      });
    };
    players.length > 0 && fetchData();
  }, [players]);

  return (
    <StyledProfile>
      <div className="container">
        <ScrollAnimation duration={1} animateIn="bounceInLeft" animateOnce>
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '10px',
              boxShadow: '0px 0px 2rem rgb(76 76 109 / 50%)',
              // background: "linear-gradient(to right,#A5FECB,#429dde,#7b4ffc)",
              height: '150px',
              marginBottom: '2em',
            }}
          >
            <ProfileHeading
              players={players}
              votes={votes}
              vouchers={vouchers}
              gameItems={gameItems}
            />
          </div>
        </ScrollAnimation>
        <ScrollAnimation duration={0} animateIn="bounceInRight" animateOnce>
          <div className="content">
            {/* <h2>My Stats</h2> */}
            <div className="stats">
              <div className="tile">
                <h4>Portfolio Value</h4>
                <p>
                  {parseFloat(utils.formatEther(nftsValue)).toFixed(4)} Matic
                </p>
              </div>
              <div className="tile">
                <h4>Account Balance</h4>
                <p>{parseFloat(utils.formatEther(balance)).toFixed(4)} Matic</p>
              </div>
              <div className="tile">
                <h4>Earnings</h4>
                <p>
                  {parseFloat(
                    utils.formatEther(
                      earnings.length > 0
                        ? earnings.reduce((acc, curr) => acc + curr.amount, 0)
                        : 0
                    )
                  ).toFixed(4)}{' '}
                  Matic
                </p>
              </div>
            </div>
          </div>
        </ScrollAnimation>
        <ScrollAnimation duration={0} animateIn="bounceInLeft" animateOnce>
          <div className="content">
            <h3> MY PLAYERS</h3>
            <div className="players">
              {players.length > 0 ? (
                players
                  .map((item) => (
                    <Item
                      key={uuid()}
                      to={`/view/${item?.metadata?.id}`}
                      title={item?.metadata?.name}
                      image={item?.metadata?.image || '/logo.png'}
                      type={`Owned`}
                      showPrice={false}
                      tokenId={item?.metadata?.id}
                      tokenAddress={config.PLAYER_NFT_ADDRESS}
                    />
                  ))
              ) : isLoading ? (
                <>
                  <ItemSkeleton />
                  <ItemSkeleton />
                  <ItemSkeleton />
                  <ItemSkeleton />
                </>
              ) : (
                'No players found'
              )}
            </div>
          </div>
        </ScrollAnimation>
        <ScrollAnimation duration={0} animateIn="bounceInLeft" animateOnce>
          <div className="content">
            <h3> MY VOTES</h3>
            <div className="players">
              {votes.length > 0 ? (
                votes.map((item) => (
                  <Item
                    key={uuid()}
                    // to={`/view/${item?.metadata?.id}`}
                    title={item?.metadata?.name}
                    image={item?.metadata?.image || '/logo.png'}
                    type={`Owned`}
                  />
                ))
              ) : isLoading ? (
                <>
                  <ItemSkeleton />
                  <ItemSkeleton />
                  <ItemSkeleton />
                  <ItemSkeleton />
                </>
              ) : (
                'No votes found'
              )}
            </div>
          </div>
        </ScrollAnimation>
        <ScrollAnimation duration={0.5} animateIn="bounceInLeft" animateOnce>
          <div className="content">
            <h3> MY CLUB ITEMS</h3>
            <div className="players">
              {gameItems.length > 0 ? (
                gameItems.map((item) => (
                  <Item
                    key={uuid()}
                    to={`/view/${item?.metadata?.id}`}
                    title={item?.metadata?.name}
                    image={item?.metadata?.image || '/logo.png'}
                    type={`Owned`}
                  />
                ))
              ) : isLoading ? (
                <>
                  <ItemSkeleton />
                  <ItemSkeleton />
                  <ItemSkeleton />
                  <ItemSkeleton />
                </>
              ) : (
                'No club items found'
              )}
            </div>
          </div>
        </ScrollAnimation>
        <ScrollAnimation duration={1} animateIn="bounceInLeft" animateOnce>
          <div className="content">
            <h3> MY PACKS</h3>
            <div className="players">
              {myPacks.length > 0 ? (
                myPacks.map((item, i) => (
                  // <Item
                  //   key={uuid()}
                  //   to={`/view/${item?.metadata?.id}`}
                  //   title={item?.metadata?.name}
                  //   image={item?.metadata?.image || "/logo.png"}
                  //   type={`Owned`}
                  // />
                  <ClubBoxWidget pack={item} key={i} />
                ))
              ) : isLoading ? (
                <>
                  <ItemSkeleton />
                  <ItemSkeleton />
                  <ItemSkeleton />
                  <ItemSkeleton />
                </>
              ) : (
                'No packs found'
              )}
            </div>
          </div>
        </ScrollAnimation>
      </div>
    </StyledProfile>
  );
}

const StyledProfile = styled.div`
  padding: 0 1rem 6rem;
  min-height: 100vh;
  position: relative;
  background-color: #eef0f8;
  .container {
    max-width: 1366px;
    margin: 0 auto;
    padding: 50px 0;
  }
  h1 {
    color: ${colors.primary};
  }
  h2 {
    color: ${colors.primary};
    font-size: 1.8rem;
  }
  .content {
    padding: 2rem;
    position: relative;
    z-index: 2;
    margin-top: 3rem;
    background-color: white;
    box-shadow: 0px 0px 2rem rgb(76 76 109 / 50%);
    border-radius: 10px;
    .title {
      margin-top: 2rem;
      color: ${colors.secondary};
    }
    h3 {
      font-weight: bold;
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
      .chart {
        position: relative;
        z-index: 99;
        height: 200px;
        padding: 2rem 0 0;
        margin: 1rem 0 2rem;
        border-radius: 0.5rem;
        background-color: #fff;
        box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1),
          0 1px 2px -1px rgb(0 0 0 / 0.1);
        transition: all 0.3s ease;
        .stat {
          position: absolute;
          top: 1rem;
          left: 1rem;
          h5 {
            font-size: 1rem;
            font-weight: bold;
          }
          p {
            font-size: 0.9rem;
            margin-top: 0.25rem;
            font-weight: bold;
          }
        }
      }

      .chart:hover {
        transform: translateY(-5px);
        box-shadow: 0 20px 30px -12px rgb(83 81 81 / 58%);
        transition: all 0.5s ease;
      }
      .first {
        background-color: #eabcce;
      }
      .second {
        background-color: #bee7ec;
      }
      .third {
        background-color: #c7efd9;
      }
    }
    .players {
      margin-top: 1.5rem;
      display: grid;
      // font-weight: bold;
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
