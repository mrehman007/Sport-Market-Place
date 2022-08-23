import styled from 'styled-components';
import { colors } from '../styles/colors';
import Button from '../components/Button';
import { useContext, useEffect, useState } from 'react';
import { ContractContext, GlobalContext } from '../context';
import { toast } from 'react-toastify';

export default function Vote() {
  const { address } = useContext(GlobalContext);
  const { getUpcomingChallenges, castingVotes, getMyVotes, getVoters } =
    useContext(ContractContext);

  const [challenges, setChallenges] = useState([]);
  const [selected, setSelected] = useState({});
  const [votes, setMyVotes] = useState([]);

  useEffect(() => {
    getMyVotes()
      .then((result) => {
        setMyVotes(result || []);
      })
      .catch((err) => {
        setMyVotes([]);
      });

    getUpcomingChallenges()
      .then(async (results) => {
        results = await Promise.all(
          results.map(async (challenge) => {
            let _voters = await getVoters(challenge.id);
            let voteIds = votes.map((voter) => Number(voter.metadata.id));

            return {
              ...challenge,
              voted: _voters.some((_vote) =>
                voteIds.includes(Number(_vote.tokenId))
              ),
            };
          })
        );

        setChallenges(
          results.filter((challenge) => Date.now() < challenge.endTime)
        );
      })
      .catch((err) => {
        toast.error(err.message || err);
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  const handleCastVote = async (e) => {
    e.preventDefault();

    let _selected = Object.values(selected).map((_challenge) => {
      if (_challenge) {
        return _challenge;
      }
      return null;
    });
    _selected = _selected.filter((_challenge) => _challenge);
    if (_selected.length === 0) {
      toast.error('Please select at least one challenge');
      return;
    }

    let ids = Array.from(new Set(challenges.map((challenge) => challenge.id)));
    let _voters = [];

    await Promise.all(
      ids.map(async (id) => {
        _voters.push(...(await getVoters(id)));
      })
    );
    let _votes = votes.filter(
      (voter) =>
        !_voters.some(
          (_vote) => Number(voter.metadata.id) === Number(_vote.tokenId)
        )
    );

    if (_votes.length < _selected.length) {
      toast.error(
        'You selected more challenges than you have votes for.\nYou have ' +
        _votes.length +
        ' vote(s) and selected ' +
        _selected.length +
        ' challenges'
      );
      return;
    }
    const confirm = window.confirm(
      'Are you sure you want to cast these votes for:\n ' +
      _selected
        .map((_challenge, i) => `${i + 1}. ${_challenge.title}`)
        .join('\n') +
      '?'
    );
    if (confirm) {
      castingVotes(
        _selected.map((vote, i) => {
          return {
            challengeId: vote.id,
            assetContract: vote.assetContract,
            tokenId: Number(_votes[i]?.metadata?.id),
          };
        })
      );
    } else {
      toast.error('Voting cancelled');
      return;
    }
  };
  return (
    <StyledVote>
      <div className="container">
        <div className="content">
          <h1>Challenges</h1>
          {challenges.length > 0 && (
            <h3 className="title">Vote for next week{"'"}s challenge</h3>
          )}
          {challenges.length < 1 && (
            <h3 className="title">No challenges available</h3>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <div className="selectables">
              {challenges.map((challenge, i) => (
                <label className="selectable" key={i}>
                  {/* <input
                    type="checkbox"
                    id={`selectable-${challenge.id}`}
                    name={`selectable-${challenge.id}`}
                    value={challenge.id}
                  /> */}
                  <div className="vote-item">
                    <h3>{challenge.title}</h3>
                    {challenge.voted ? (
                      <span>Voted</span>
                    ) : (
                      <button
                        onClick={() => {
                          setSelected({
                            ...selected,
                            [challenge.id]: selected[challenge.id]
                              ? null
                              : challenge,
                          });
                        }}
                      >
                        {selected[challenge.id] ? 'Selected' : 'Vote'}
                      </button>
                    )}
                  </div>
                </label>
              ))}
            </div>
            {challenges.length > 0 && (
              <div className="submit">
                <Button type="submit" primary onClick={handleCastVote}>
                  Vote Now
                </Button>
              </div>
            )}
          </form>
        </div>
      </div>
    </StyledVote>
  );
}

const StyledVote = styled.div`
  padding: 2rem 2rem 6rem;
  min-height: 100vh;
  position: relative;
  /* background-color: #eef0f8; */
  h1 {
    color: ${colors.primary};
  }
  h3 {
    font-weight: bold;
    color: white;
  }
  .content {
    position: relative;
    z-index: 2;
    .title {
      margin-top: 2rem;
      color: ${colors.secondary};
    }
  }
  form {
    display: block;
  }
  .selectables {
    margin-top: 1.5rem;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
    @media (max-width: 1024px) {
      grid-template-columns: repeat(3, 1fr);
    }
    @media (max-width: 768px) {
      grid-template-columns: repeat(2, 1fr);
    }
    @media (max-width: 500px) {
      grid-template-columns: repeat(1, 1fr);
    }
  }
  .selectable {
    overflow: hidden;
    transition: 0.5s;
    display: block;
    position: relative;
    border-radius: 0.5rem;
    input {
      border: 1px solid red;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      cursor: pointer;
      z-index: 2;
      &:checked ~ .vote-item {
        background-color: ${colors.primary};
        color: #fff;
      }
      /* &:focus ~ .vote-item {
        box-shadow: 0 0 0 2px ${colors.primary};
      } */
    }
    .vote-item {
      // background-color: white;
      background: linear-gradient(
        90deg,
        rgba(255, 87, 87, 1) 0%,
        rgba(247, 87, 87, 1) 25%,
        rgba(255, 154, 154, 1) 50%,
        rgba(255, 87, 87, 1) 50%,
        rgba(247, 87, 87, 1) 75%,
        rgba(255, 154, 154, 1) 100%
      );
      transition: all 0.5s ease-in-out !important;
      background-size: 200% 100%;

      padding: 1rem;
      // border: 2px solid ${colors.secondary};
      border-radius: 0.5rem;
      transition: background-color 0.2s ease-in-out;
      display: flex;
      justify-content: space-between;
      align-items: center;
      min-height: 8rem;
      pointer-events: none;
      svg {
        font-size: 1.5rem;
        margin-bottom: 0.5rem;
      }
      button {
        background: rgba(${colors.secondaryRGB}, 0.8) !important;
        color: ${colors.background} !important;
        border: none;
        padding: 0.3rem 1rem;
        border-radius: 0.25rem;
        font-size: 0.9rem;
        cursor: pointer;
        transition: all 0.2s ease-in-out;
        font-weight: bold;
        &:hover {
          background: rgba(${colors.secondaryRGB}, 1) !important;
        }
      }
      @media (max-width: 500px) {
        min-height: 7em;
      }
    }
  }
  // .selectable:hover .vote-item {
  //   box-shadow: 0px 0px 20px 10px #1572a1;
  // }
  // .selectable:hover svg {
  //   color: #1572a1;
  // }
  // .selectable:hover h3 {
  //   color: #1572a1;
  //   text-shadow: 0px 0px 30px #1572a1;
  // }

  .selectable:hover {
    transform: perspective(500px) rotateY(15deg);
    text-shadow: -6px 3px 2px rgba(0, 0, 0, 0.2);
    box-shadow: -2px 0 0 5px rgba(0, 0, 0, 0.2);
  }
  .selectable:hover .vote-item {
    background-position: 100% 0;
  }
  .selectable::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(to right, transparent, white, transparent);
    left: -100%;
    transition: 0.5s;
  }

  .selectable:hover::before {
    left: 100%;
  }

  .submit {
    margin-top: 1.5rem;
    display: flex;
    justify-content: center;
  }

  .submit button:hover,
  .submit button:focus {
    box-shadow: 0 0.5em 0.5em -0.4em #1572a1;
    transform: translateY(-0.25em);
  }
`;
