import { Contract, providers } from 'ethers';
import { useContext } from 'react';
import { toast } from 'react-toastify';
import { config } from '../../config';
import { GlobalContext } from '../../context';
import { TournamentABI } from '../../helpers';
import Router from 'next/router';

export const useContract = () => {
  const { setIsLoading, getProviderOrSigner } = useContext(GlobalContext);

  const proposeChallenge = async (challenges) => {
    toast.promise(
      new Promise(async (resolve, reject) => {
        setIsLoading(true);
        try {
          const signer = await getProviderOrSigner(true);
          const TournamentContract = new Contract(
            config.VOTING_CRT_ADDRESS,
            JSON.stringify(TournamentABI),
            signer
          );

          const tx = await TournamentContract.proposeChallenge(challenges);
          const provider = await getProviderOrSigner();
          await provider.waitForTransaction(tx.hash, 1);
          Router.push('/vote');
          setGlobalStateChanged(!globalStateChanged);
          resolve(`Challenges created successfully at tx: ${tx.hash}`);
        } catch (error) {
          let _error = JSON.parse(JSON.stringify(error)) || error;
          reject(
            `Error: ${
              _error?.reason || _error?.data?.message || _error?.message
            }`
          );
        }
        setIsLoading(false);
      }),
      {
        loading: 'Creating challenges...',
        success: (msg) => `${String(msg)}`,
        error: (msg) => `${String(msg)}`,
      }
    );
  };

  const getRewards = async () => {
    setIsLoading(true);
    try {
      const provider = await getProviderOrSigner();

      const potContract = new Contract(
        config.MLB_POT_ADDRESS,
        [
          {
            inputs: [],
            name: 'getRewards',
            outputs: [
              {
                components: [
                  {
                    internalType: 'uint256',
                    name: 'id',
                    type: 'uint256',
                  },
                  {
                    internalType: 'address',
                    name: 'recipient',
                    type: 'address',
                  },
                  {
                    internalType: 'uint256',
                    name: 'amount',
                    type: 'uint256',
                  },
                  {
                    internalType: 'uint256',
                    name: 'timestamp',
                    type: 'uint256',
                  },
                ],
                internalType: 'struct Pot.Reward[]',
                name: '_rewards',
                type: 'tuple[]',
              },
            ],
            stateMutability: 'view',
            type: 'function',
          },
        ],
        provider
      );

      const rewards = await potContract.getRewards();
      setIsLoading(false);
      return rewards.map((reward) => ({
        id: Number(reward.id),
        recipient: reward.recipient,
        value: Number(reward.amount),
        timestamp: Number(reward.timestamp) * 1000,
      }));
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      let _error = JSON.parse(JSON.stringify(error)) || error;
      toast.error(
        `Error: ${_error?.reason || _error?.data?.message || _error?.message}`
      );
      return [];
    }
  };

  const getUpcomingChallenges = async () => {
    try {
      const provider = await getProviderOrSigner();
      const TournamentContract = new Contract(
        config.VOTING_CRT_ADDRESS,
        JSON.stringify(TournamentABI),
        provider
      );

      const _challengesCount = Number(
        await TournamentContract.challengesCount()
      );

      let challenges = [];

      for (let i = _challengesCount; i > 0; i--) {
        let _challenge = await TournamentContract._challenges(i);

        _challenge = {
          id: i,
          proposer: _challenge.proposer,
          startTime: new Date(Number(_challenge.startTime) * 1000),
          endTime: new Date(Number(_challenge.endTime) * 1000),
          title: _challenge.title,
          forVotes: Number(_challenge.forVotes),
          assetContract: _challenge.assetContract,
        };

        challenges.push(_challenge);
      }
      return challenges;
    } catch (error) {
      // throw new Error(error);
      console.log(error);
      return [];
    }
  };

  const castingVotes = async (votes) => {
    toast.promise(
      new Promise(async (resolve, reject) => {
        setIsLoading(true);
        try {
          const signer = await getProviderOrSigner(true);
          const TournamentContract = new Contract(
            config.VOTING_CRT_ADDRESS,
            JSON.stringify(TournamentABI),
            signer
          );

          const tx = await TournamentContract.castVote(votes);
          const provider = await getProviderOrSigner();
          await provider.waitForTransaction(tx.hash, 1);

          setGlobalStateChanged(!globalStateChanged);
          Router.push('/vote');
          resolve(`Vote casted successfully at tx: ${tx.hash}`);
        } catch (error) {
          let _error = JSON.parse(JSON.stringify(error)) || error;
          reject(
            `Error: ${
              _error?.reason || _error?.data?.message || _error?.message
            }`
          );
        }
        setIsLoading(false);
      }),
      {
        loading: 'Casting votes...',
        success: (msg) => `${String(msg)}`,
        error: (msg) => `${String(msg)}`,
      }
    );
  };

  const getTopChallenges = async (startTime, endTime) => {
    try {
      const provider = await getProviderOrSigner();
      const TournamentContract = new Contract(
        config.VOTING_CRT_ADDRESS,
        JSON.stringify(TournamentABI),
        provider
      );

      let _challengeCount = Number(await TournamentContract.challengesCount());

      let _challenges = [];

      for (let i = _challengeCount; i > 0; i--) {
        let challenge = await TournamentContract._challenges(i);
        challenge = {
          id: Number(challenge.id),
          proposer: challenge.proposer,
          startTime: new Date(Number(challenge.startTime) * 1000),
          endTime: new Date(Number(challenge.endTime) * 1000),
          title: challenge.title,
          forVotes: Number(challenge.forVotes),
          assetContract: challenge.assetContract,
        };
        challenge.endTime.getTime() > Date.now() && _challenges.push(challenge);
      }
      // sort challenges by id
      return _challenges.sort((a, b) => b.forVotes - a.forVotes);
    } catch (error) {
      // throw new Error(error);
      console.log(error);
      return [];
    }
  };

  const payoutPlayers = async (
    _challengeId,
    _recipients,
    _amounts,
    _currency
  ) => {
    toast.promise(
      new Promise(async (resolve, reject) => {
        setIsLoading(true);
        try {
          const signer = await getProviderOrSigner(true);
          const mlbPot = new Contract(
            config.MLB_POT_ADDRESS,
            [
              {
                inputs: [
                  {
                    internalType: 'uint256',
                    name: '_challengeId',
                    type: 'uint256',
                  },
                  {
                    internalType: 'address[]',
                    name: '_recipients',
                    type: 'address[]',
                  },
                  {
                    internalType: 'uint256[]',
                    name: '_amounts',
                    type: 'uint256[]',
                  },
                  {
                    internalType: 'address',
                    name: '_currency',
                    type: 'address',
                  },
                ],
                name: 'payout',
                outputs: [],
                stateMutability: 'payable',
                type: 'function',
              },
            ],
            signer
          );

          const tx = await mlbPot.payout(
            _challengeId,
            _recipients,
            _amounts,
            _currency
          );
          const provider = await getProviderOrSigner();
          await provider.waitForTransaction(tx.hash, 1);
          setGlobalStateChanged(!globalStateChanged);
          Router.push('/vote');
          resolve(`Players successfully paid at tx: ${tx.hash}`);
        } catch (error) {
          let _error = JSON.parse(JSON.stringify(error)) || error;
          reject(
            `Error: ${
              _error?.reason || _error?.data?.message || _error?.message
            }`
          );
        }
        setIsLoading(false);
      }),
      {
        loading: 'Paying players...',
        success: (msg) => `${String(msg)}`,
        error: (msg) => `${String(msg)}`,
      }
    );
  };

  const getVoters = async (challengeId) => {
    try {
      const provider = await getProviderOrSigner();
      const TournamentContract = new Contract(
        config.VOTING_CRT_ADDRESS,
        JSON.stringify(TournamentABI),
        provider
      );

      return await TournamentContract.getVoters(challengeId);
    } catch (error) {
      // throw new Error(error);
      console.log(error);
      return [];
    }
  };
  return {
    proposeChallenge,
    getUpcomingChallenges,
    castingVotes,
    getTopChallenges,
    payoutPlayers,
    getVoters,
    getRewards,
  };
};
