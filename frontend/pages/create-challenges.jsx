import { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import Button from '../components/Button';
import { config } from '../config';
import { ContractContext } from '../context';
import { colors } from '../styles/colors';

export default function CreateChallenges() {
  const [challenge1Title, setChallenge1Title] = useState('');
  const [challenge2Title, setChallenge2Title] = useState('');
  const [challenge3Title, setChallenge3Title] = useState('');
  const [challenge4Title, setChallenge4Title] = useState('');
  const [challenge5Title, setChallenge5Title] = useState('');
  const [startTime, setStartTime] = useState(
    new Date().toISOString().split(':').slice(0, 2).join(':')
  );
  const [endTime, setEndTime] = useState(
    new Date(new Date().setHours(24 * 7))
      .toISOString()
      .split(':')
      .slice(0, 2)
      .join(':')
  );
  const [assetContract, setAssetContract] = useState(config.VOTE_NFT_ADDRESS);

  const { proposeChallenge } = useContext(ContractContext);

  const handleCreateChallenges = async (e) => {
    e.preventDefault();

    const challenges = [
      challenge1Title,
      challenge2Title,
      challenge3Title,
      challenge4Title,
      challenge5Title,
    ];

    if (challenges.some((challenge) => challenge.trim() === '')) {
      toast.error('Please fill in all challenges');
      return;
    }

    if (new Date(startTime) > new Date(endTime)) {
      toast.error('Start time must be before end time');
      return;
    }
    if (new Date(endTime) < new Date()) {
      toast.error('End time must be in the future');
      return;
    }

    const _startTimeInSeconds = Math.floor(
      new Date(startTime).getTime() / 1000
    );
    const _endTimeInSeconds = Math.floor(new Date(endTime).getTime() / 1000);

    const proposal = challenges.map((challenge) => {
      return {
        title: challenge,
        startTime: _startTimeInSeconds,
        secondsUntilEndTime: _endTimeInSeconds - _startTimeInSeconds,
        assetContract,
      };
    });

    await proposeChallenge(proposal);
  };
  return (
    <StyledCreateChallenges>
      <h1>Create Challenges</h1>
      <form>
        <label>
          <h4>Challenge 1</h4>
          <input
            type="text"
            placeholder="Challenge 1 Title"
            onChange={(e) => setChallenge1Title(e.target.value?.trim())}
          />
        </label>
        <label>
          <h4>Challenge 2</h4>
          <input
            type="text"
            placeholder="Challenge 2 Title"
            onChange={(e) => setChallenge2Title(e.target.value?.trim())}
          />
        </label>
        <label>
          <h4>Challenge 3</h4>
          <input
            type="text"
            placeholder="Challenge 3 Title"
            onChange={(e) => setChallenge3Title(e.target.value?.trim())}
          />
        </label>
        <label>
          <h4>Challenge 4</h4>
          <input
            type="text"
            placeholder="Challenge 4 Title"
            onChange={(e) => setChallenge4Title(e.target.value?.trim())}
          />
        </label>
        <label>
          <h4>Challenge 5</h4>
          <input
            type="text"
            placeholder="Challenge 5 Title"
            onChange={(e) => setChallenge5Title(e.target.value?.trim())}
          />
        </label>
        <label>
          <h4>Start Time</h4>
          <input
            type="datetime-local"
            name="start_time"
            required
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </label>
        <label>
          <h4>End Time</h4>
          <input
            type="datetime-local"
            name="end_time"
            required
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </label>
        <label>
          <h4>Asset Contract</h4>
          <input
            type="text"
            placeholder="Asset Contract"
            value={assetContract}
            onChange={(e) => setAssetContract(e.target.value?.trim())}
          />
        </label>
        <Button primary onClick={handleCreateChallenges}>
          Create
        </Button>
      </form>
    </StyledCreateChallenges>
  );
}

const StyledCreateChallenges = styled.div`
  padding: 4rem 2rem;
  max-width: 768px;
  margin: 0 auto;
  form {
    width: 100%;
    label {
      display: block;
      margin-bottom: 0.5rem;
      h4 {
        font-size: 1rem;
        font-weight: 700;
        color: ${(props) => colors.secondary};
      }
      input {
        width: 100%;
        border: 1px solid #ccc;
        border-radius: 5px;
        padding: 0.8rem 1.2rem;
        font-size: 0.9rem;
        font-weight: 400;
        color: ${(props) => colors.secondary};
        &:focus {
          outline: none;
          border: 1px solid ${(props) => colors.primary};
        }
      }
    }
    button {
      margin-top: 0.5rem;
    }
  }
`;
