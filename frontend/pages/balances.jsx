import { Contract, utils } from 'ethers';
import { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import Chart from '../components/Chart';
import { config } from '../config';
import { GlobalContext } from '../context';

export default function Balances() {
  const {
    isLoading,
    globalStateChanged,
    address,
    balances,
    getProviderOrSigner,
  } = useContext(GlobalContext);
  const [balance, setBalance] = useState(0);
  const [mlbBalance, setMLBBalance] = useState(0);
  const [wmaticBalance, setWmaticBalance] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const provider = await getProviderOrSigner();

      address &&
        setBalance(utils.formatEther(await provider.getBalance(address)));
      setMLBBalance(
        utils.formatEther(await provider.getBalance(config.MLB_POT_ADDRESS))
      );

      const contract = new Contract(
        config.WMATIC_ADDRESS,
        [
          {
            constant: true,
            inputs: [
              {
                name: '_owner',
                type: 'address',
              },
            ],
            name: 'balanceOf',
            outputs: [
              {
                name: 'balance',
                type: 'uint256',
              },
            ],
            payable: false,
            type: 'function',
          },
        ],
        provider
      );

      setWmaticBalance(await contract.balanceOf(config.MLB_POT_ADDRESS));
    };
    fetchData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, config.MLB_POT_ADDRESS]);

  return (
    <StyledBalances>
      <h1>Balances</h1>
      <div className="stats">
        <div className="tile">
          <h4>My Balance</h4>
          <p>{parseFloat(balance).toFixed(4)} MATIC</p>
        </div>
        <div className="tile">
          <h4>MLB Pot Balance</h4>
          <p>{parseFloat(mlbBalance).toFixed(4)} MATIC</p>
        </div>
        <div className="tile">
          <h4>MLB Pot Balance (WMATIC)</h4>
          <p>{parseFloat(wmaticBalance).toFixed(4)} WMATIC</p>
        </div>
      </div>
    </StyledBalances>
  );
}

const StyledBalances = styled.div`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  padding: 4rem 2rem;
  max-width: 1000px;
  margin: 0 auto;
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
    .tile {
      border-radius: 0.5rem;
      padding: 1rem;
      border: 1px solid #ccc;
      h4 {
        font-size: 1rem;
      }
      p {
        font-size: 1.5rem;
        font-weight: 600;
      }
    }
    .chart {
      position: relative;
      z-index: 99;
      height: 200px;
      padding: 2rem 0 0;
      margin: 1rem 0 2rem;
      border-radius: 0.5rem;
      background-color: #fff;
      box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
      transition: all 0.3s ease;
      .stat {
        position: absolute;
        top: 1rem;
        left: 1rem;
        h5 {
          font-size: 1rem;
        }
        p {
          font-size: 0.9rem;
          margin-top: 0.25rem;
          font-weight: 600;
        }
      }
    }
  }
`;
