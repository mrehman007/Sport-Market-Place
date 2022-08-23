import { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import logo from '../assets/logo.png';
import Button from '../components/Button';
import Select, { Option } from '../components/FormElements/Select';
import { ContractContext, GlobalContext } from '../context';
import { colors } from '../styles';

import dateFormat from 'dateformat';
import { toast } from 'react-toastify';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { config } from '../config';
import { humanizeAddress, weeksInYear } from '../helpers';
import { utils } from 'ethers';

export default function Payout() {
  const { getProviderOrSigner, globalStateChanged } = useContext(GlobalContext);
  const [topChallenges, setTopChallenges] = useState([]);

  const { getTopChallenges, payoutPlayers } = useContext(ContractContext);

  const [_challenges, setChallenges] = useState([]);
  const [selectedChallenge, setSelectedChallenge] = useState('');

  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [selected, setSelected] = useState({});
  const [mlbBalance, setMlbBalance] = useState(0);

  useEffect(() => {
    const getAllPlayers = async () => {
      const provider = await getProviderOrSigner();
      const sdk = new ThirdwebSDK(provider);

      const contract = sdk.getNFTCollection(config.PLAYER_NFT_ADDRESS);

      setPlayers(await contract.getAll());
      setFilteredPlayers(await contract.getAll());

      setMlbBalance(await provider.getBalance(config.MLB_POT_ADDRESS));
    };
    getAllPlayers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globalStateChanged, config.PLAYER_NFT_ADDRESS, config.MLB_POT_ADDRESS]);

  useEffect(() => {
    // 14 days to seconds
    let two_weeks_earlier = 14 * 24 * 60 * 60;
    // get top challenges
    getTopChallenges(
      Math.floor(Date.now() / 1000) - two_weeks_earlier,
      Math.floor(Date.now() / 1000)
    )
      .then((result) => {
        setTopChallenges(result);
      })
      .catch((err) => {
        setTopChallenges([]);
        toast.error(err.message || err);
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setChallenges(
      selectedChallenge
        ? topChallenges.filter(
          (challenge) => challenge.id === selectedChallenge
        )
        : topChallenges
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topChallenges, selectedChallenge]);

  const handleOnPlayerSelected = (player) => {
    const { attributes, properties } = player.metadata;
    let attribute = (attributes || properties || []).find(
      (attribute) => attribute.trait_type === 'type'
    );
    let type = attribute?.value

    const holders = players.filter((player) => {
      const { attributes, properties } = player.metadata;
      let attribute = (attributes || properties || []).find(
        (attribute) => attribute.trait_type === 'type'
      );
      return attribute?.value && type && attribute?.value.toLowerCase() === type.toLowerCase();
    }
    );
    const _amountPerWeek = mlbBalance.div(
      weeksInYear(new Date().getFullYear())
    );
    const _amountPerChallenge = _amountPerWeek.div(3); // step 2: amountPerWeek / 3(no of challenges)

    let __players = {
      ...selected,
      [type]: selected[type] ? null : { ...player, holders },
    };

    let _players = Object.values(__players).filter((_v) => _v);

    const _amountPerPlayer =
      _players.length > 0 ? _amountPerChallenge.div(_players.length) : 0;

    Object.entries(__players).forEach(([key, value]) => {
      if (value) {
        __players[key].amount = _amountPerPlayer;
      }
    });
    setSelected(__players);
  };

  const handleOnPlayerSearch = (value) => {
    if (value) {
      setFilteredPlayers(
        players.filter(
          (player) =>
            player.metadata.name.toLowerCase().includes(value.toLowerCase()) ||
            // player.owner.toLowerCase() == value.toLowerCase() ||
            player.metadata.id.toString().toLowerCase() == value.toLowerCase()
        )
      );
    } else {
      setFilteredPlayers(players);
    }
  };

  const handlePayout = (e) => {
    e.preventDefault();
    let _selected = Object.values(selected).filter((_v) => _v);
    if (_selected.length === 0) {
      toast.error('Please select at least one player');
      return;
    }

    // const _players = _selected.map((player) => player.owner);
    // const _amounts = _selected.map((player) => player.amount);
    const _players = [];
    const _amounts = [];
    _selected.forEach((s) => {
      let sharedAmount = s.amount;
      let count = s.holders.length || 0
      s.holders && s.holders.forEach((h) => {
        _players.push(h.owner);
        _amounts.push(sharedAmount.div(count));
      }
      );
    }
    );

    if (_players.length !== _amounts.length) {
      toast.error('Please select the same number of players and amounts');
      return;
    }

    if (!selectedChallenge) {
      toast.error('Please select a challenge to continue.');
      return;
    }
    const _challengeId = selectedChallenge;
    const _currency = config.CHAIN_NATIVE_TOKEN_ADDRESS;

    const challenge = topChallenges.find(
      (challenge) => challenge.id === _challengeId
    );

    const amountToPay = _amounts.reduce((acc, a) => acc + Number(a), 0);

    if (amountToPay > mlbBalance) {
      toast.error("You don't have enough MLB balance to payout");
      return;
    }

    if (amountToPay === 0) {
      toast.error('Amount to payout is zero');
      return;
    }
    // prompt for confirmation
    const confirm = window.confirm(
      `Are you sure you want to payout ${_players.length} players for challenge ${challenge.title}?`
    );
    if (confirm) {
      payoutPlayers(_challengeId, _players, _amounts, _currency);
    } else {
      toast.error('Payout cancelled');
      return;
    }
  };

  return (
    <StyledPayout>
      <h2>Top Voted Challenges</h2>
      <div className="wrapper">
        <div className="table">
          <div
            className="table__header"
            onClick={() => selectedChallenge && setSelectedChallenge('')}
          >
            <h4>#</h4>
            <h4>Challenge Title</h4>
            <h4>For Votes</h4>
            <h4>Start Date</h4>
            <h4>End Date</h4>
            <h4>Challenge ID</h4>
            <h4>Selected</h4>
          </div>
          <div className="table__body">
            {topChallenges.map((challenge, index) => (
              <div
                className="table__body-row"
                key={index}
                onClick={() => setSelectedChallenge(challenge.id)}
              >
                <p>{index + 1}</p>
                <p>{challenge.title}</p>
                <p>{challenge.forVotes}</p>
                <p>{dateFormat(new Date(challenge.startTime))}</p>
                <p>{dateFormat(new Date(challenge.endTime))}</p>
                <p>{challenge.id}</p>
                <p
                  style={{
                    fontWeight:
                      challenge.id === selectedChallenge ? 'bold' : 'normal',
                    cursor: 'pointer',
                  }}
                >
                  {challenge.id === selectedChallenge
                    ? 'SELECTED'
                    : 'Not Selected'}
                </p>
              </div>
            ))}
            {topChallenges.length == 0 && (
              <p
                style={{
                  textAlign: 'center',
                  margin: '1.5rem',
                }}
              >
                No challenges found{' '}
              </p>
            )}
          </div>
        </div>
      </div>
      <div
        style={{
          marginTop: '1.5rem',
          marginBottom: '1.5rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h3 className="title">SELECTED WINNING PLAYERS</h3>
          <p>
            MLB Pot Balance:{' '}
            {parseFloat(utils.formatEther(mlbBalance)).toFixed(4)} MATIC
          </p>
          <form onSubmit={(e) => e.preventDefault()}>
            <Button
              primary
              onClick={handlePayout}
              disabled={Object.values(selected).filter((_v) => _v).length === 0}
            >
              PAYOUT
            </Button>
          </form>
        </div>
        <div className="wrapper">
          <div className="table">
            <div className="table__header">
              <h4>#</h4>
              <h4>Name</h4>
              <h4>Asset Contract</h4>
              <h4>Token ID</h4>
              <h4>Selected</h4>
              <h4>Est Payout Amount</h4>
              <h4>Holders Count ({Object.values(selected)
                .filter((_v) => _v)
                .map((nft) => nft.holders.length
                )
                .reduce((acc, a) => acc + a, 0)})

              </h4>
            </div>
            <div className="table__body">
              {Object.values(selected)
                .filter((_v) => _v)
                .map((nft, i) => {
                  return (
                    <div
                      className="table__body-row"
                      key={i}
                      onClick={() => handleOnPlayerSelected(nft)}
                    >
                      <p>{i + 1}</p>
                      <p>{nft.metadata.name}</p>
                      <p>{humanizeAddress(config.PLAYER_NFT_ADDRESS)}</p>
                      <p>{Number(nft.metadata.id)}</p>
                      <p
                        style={{
                          fontWeight: selected[nft.metadata.id]
                            ? 'bold'
                            : 'normal',
                          cursor: 'pointer',
                        }}
                      >
                        {selected[Number(nft.metadata.id)]
                          ? 'SELECTED'
                          : 'Not Selected'}
                      </p>
                      <p>
                        {parseFloat(utils.formatEther(nft.amount)).toFixed(6)}{' '}
                        MATIC
                      </p>
                      <p>{nft?.holders?.length || 0} <em><b>(@ ~={nft?.holders?.length || 0 > 0 ? (parseFloat(utils.formatEther(nft.amount)) / (nft.holders.length)).toFixed(6) : 0}) Matic </b></em></p>
                    </div>
                  );
                })}
              {Object.values(selected).filter((_v) => _v)?.length == 0 && (
                <p
                  style={{
                    textAlign: 'center',
                    margin: '1.5rem',
                  }}
                >
                  No players selected
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      <div>
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            placeholder="Search player by name or tokenId"
            onChange={(e) => handleOnPlayerSearch(e.target.value.trim())}
          />
        </form>
        <h3 className="title">ALL PLAYERS</h3>
        <div className="wrapper">
          <div className="table">
            <div className="table__header">
              <h4>#</h4>
              <h4>Name</h4>
              <h4>Owner</h4>
              <h4>Asset Contract</h4>
              <h4>Token ID</h4>
              <h4>Selected</h4>
              <h4>Date Paid</h4>
            </div>
            <div className="table__body">
              {filteredPlayers?.map((nft, i) => {
                return (
                  <div
                    className="table__body-row"
                    key={i}
                    onClick={() => handleOnPlayerSelected(nft)}
                  >
                    <p>{i + 1}</p>
                    <p>{nft.metadata.name}</p>
                    <p>{humanizeAddress(nft.owner)}</p>
                    <p>{humanizeAddress(config.PLAYER_NFT_ADDRESS)}</p>
                    <p>{Number(nft.metadata.id)}</p>
                    <p
                      style={{
                        fontWeight: selected[nft.metadata.id]
                          ? 'bold'
                          : 'normal',
                        cursor: 'pointer',
                      }}
                    >
                      {selected[Number(nft.metadata.id)]
                        ? 'SELECTED'
                        : 'Not Selected'}
                    </p>
                    <p>{nft.metadata.amount || ''}</p>
                  </div>
                );
              })}
              {filteredPlayers?.length == 0 && (
                <p
                  style={{
                    textAlign: 'center',
                    margin: '1.5rem',
                  }}
                >
                  No players found
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </StyledPayout>
  );
}

const StyledPayout = styled.div`
  * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }
  padding: 4rem 2rem;
  h2 {
    margin-bottom: 1rem;
  }
  .title {
    font-size: 1.2rem;
    font-weight: 600;
    color: ${colors.secondary};
    margin-top: 2rem;
    /* margin-bottom: 1rem; */
  }
  form {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
    button {
      padding: 0.8rem 1.2rem;
      border: none;
      margin-left: 1rem;
      width: fit-content;
    }
    input {
      width: 100%;
      border: 1px solid #ccc;
      border-radius: 5px;
      padding: 0.8rem 1.2rem;
      font-size: 0.9rem;
      font-weight: 400;
      color: ${colors.secondary};
      &:focus {
        outline: none;
        border: 1px solid ${colors.primary};
      }
    }
  }
  .wrapper {
    width: 100%;
    overflow: auto;
    margin-top: 1rem;
  }
  .table {
    border-radius: 0.5rem;
    border: 1px solid ${(props) => `rgba(${colors.secondaryRGB}, 0.5)`};
    min-width: 1000px;
    button {
      width: fit-content;
      padding: 0.3rem 0.8rem;
      font-size: 0.8rem;
    }
    &__header {
      min-width: 1000px;
      display: flex;
      align-items: center;
      background: ${(props) => `rgba(${colors.primaryRGB}, 0.1)`};
      border-bottom: 1px solid ${(props) => `rgba(${colors.secondaryRGB}, 0.5)`};
      h4 {
        flex: 1;
        color: ${colors.secondary};
        font-size: 1rem;
        padding: 0.8rem 1.5rem;
        /* background: ${(props) => `rgba(${colors.primaryRGB}, 0.1)`}; */
        &:not(:last-child) {
          border-right: 1px solid
            ${(props) => `rgba(${colors.secondaryRGB}, 0.5)`};
        }
        &:first-child {
          flex: 0 0 auto;
          width: 6rem;
        }
      }
    }
    &__body {
      min-width: 1000px;
      &-row {
        display: flex;
        align-items: center;
        &:not(:last-child) {
          border-bottom: 1px solid
            ${(props) => `rgba(${colors.secondaryRGB}, 0.2)`};
        }
        p {
          flex: 1;
          color: ${colors.secondary};
          font-size: 1rem;
          padding: 0.6rem 1.5rem;
          display: flex;
          align-items: center;
          span {
            margin-left: 0.5rem;
          }
          img {
            border-radius: 50%;
            width: 24px;
            height: 24px;
          }
          &:not(:last-child) {
            border-right: 1px solid
              ${(props) => `rgba(${colors.secondaryRGB}, 0.2)`};
          }
          &:first-child {
            flex: 0 0 auto;
            width: 6rem;
          }
        }
      }
    }
  }
`;
