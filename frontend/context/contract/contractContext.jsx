import { createContext } from "react";

const defaultValue = {
    players: [],
    owned: [],
    votes: [],

    getActiveListings: async () => { },
    getOwned: async (sdk, value) => { },
    getMyVotes: async (sdk, value) => { },
    getMyVouchers: async (sdk, value) => { },
    getMyGameItems: async (sdk, value) => { },
    getMyPacks: async (sdk, value) => { },
    hasRole: async (value) => { },

    proposeChallenge: async (challenges) => { },
    getUpcomingChallenges: async () => { },
    castingVotes: async (votes) => { },
    getTopChallenges: async (start_time, end_time) => { },
    payoutPlayers: async (_challengeId,
        _recipients,
        _amounts,
        _currency) => { },

    getVoters: async (challengeId) => { },
    getRewards: async () => { },
    getMyEarnings: async () => { }

};

export const ContractContext = createContext(defaultValue);
