import { useContext, useState } from 'react';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';

import { GlobalContext } from '../global';
import { config } from '../../config'
import { ContractContext } from './contractContext'
import { Contract } from 'ethers';
import { useContract } from '../../hooks';

export const ContractProvider = ({
    children,
}) => {
    const { setIsLoading, address, getProviderOrSigner } = useContext(GlobalContext);
    const [listings, setListings] = useState([]);
    const [players, setOwned] = useState([]);
    const [votes, setVotes] = useState([]);
    const [vouchers, setVouchers] = useState([]);
    const [gameItems, setGameItems] = useState([]);
    const [myPacks, setMyPacks] = useState([]);
    const [earnings, setEarnings] = useState([]);


    const { proposeChallenge, getUpcomingChallenges, castingVotes, getRewards, getTopChallenges, payoutPlayers, getVoters } = useContract()

    const getActiveListings = async () => {
        setIsLoading(true)

        const provider = await getProviderOrSigner()

        const sdk = new ThirdwebSDK(provider);
        const marketplace = sdk.getMarketplace(config.MARKETPLACE_ADDRESS);
        let _listings = await marketplace.getActiveListings();
        setListings(_listings);
        setIsLoading(false)

        // await fetch("/api/cache", {
        //     method: "POST",
        //     headers: {
        //       "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify({
        //       page: "listings",
        //       data: listings || [],
        //     }),
        //   });

    }

    const getOwned = async (sdk, address) => {
        const collection = sdk.getNFTCollection(config.PLAYER_NFT_ADDRESS);
        let _owned = await collection.getOwned(address);
        setOwned(_owned);
    }

    const getMyVotes = async (sdk, _address = null) => {
        if (!_address) {
            _address = address || (await (await getProviderOrSigner(true)).getAddress())
        }

        const collection = sdk.getNFTCollection(config.VOTE_NFT_ADDRESS);
        let _owned = await collection.getOwned(_address);
        setVotes(_owned);
        return _owned
    }

    const getMyVouchers = async (sdk, address) => {
        const collection = sdk.getNFTCollection(config.VOUCHER_ADDRESS);
        let _owned = await collection.getOwned(address);
        setVouchers(_owned);
    }
    const getMyGameItems = async (sdk, address) => {
        const collection = sdk.getEdition(config.GAME_ITEM_ADDRESS);
        let _owned = await collection.getOwned(address);
        setGameItems(_owned);
    }
    const getMyPacks = async (sdk, address) => {
        const collection = sdk.getPack(config.PACK_ADDRESS);
        let _owned = await collection.getOwned(address);
        setMyPacks(_owned);
    }

    const getMyEarnings = async (address) => {
        const provider = await getProviderOrSigner()

        const contract = new Contract(config.MLB_POT_ADDRESS,
            [
                {
                    "inputs": [],
                    "name": "getRewards",
                    "outputs": [
                        {
                            "components": [
                                {
                                    "internalType": "uint256",
                                    "name": "id",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "address",
                                    "name": "recipient",
                                    "type": "address"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "amount",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "timestamp",
                                    "type": "uint256"
                                }
                            ],
                            "internalType": "struct Pot.Reward[]",
                            "name": "_rewards",
                            "type": "tuple[]"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                }
            ],
            provider)


        const rewards = await contract.getRewards()

        return rewards.filter(r => r.recipient.toLowerCase() === address.toLowerCase()).map((r) => ({
            id: Number(r.id),
            amount: Number(r.amount),
            timestamp: Number(r.timestamp) * 1000,
            recipient: r.recipient
        }))


    }

    const hasRole = async (address, role = 'admin') => {

        const provider = await getProviderOrSigner()

        const contract = new Contract(config.VOTING_CRT_ADDRESS,
            [
                {
                    "inputs": [
                        {
                            "internalType": "bytes32",
                            "name": "role",
                            "type": "bytes32"
                        },
                        {
                            "internalType": "address",
                            "name": "account",
                            "type": "address"
                        }
                    ],
                    "name": "hasRole",
                    "outputs": [
                        {
                            "internalType": "bool",
                            "name": "",
                            "type": "bool"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "DEFAULT_ADMIN_ROLE",
                    "outputs": [
                        {
                            "internalType": "bytes32",
                            "name": "",
                            "type": "bytes32"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                }
            ],
            provider);

        let _role = role == 'admin' ? await contract.DEFAULT_ADMIN_ROLE() : await contract.DEFAULT_ADMIN_ROLE();

        return await contract.hasRole(_role, address);

    }
    return (
        <ContractContext.Provider
            value={{
                listings,
                players,
                votes,
                gameItems,
                myPacks,
                vouchers,
                earnings,
                getActiveListings,
                getOwned,
                hasRole,
                proposeChallenge,
                getMyVotes,
                getMyVouchers,
                getMyGameItems,
                getUpcomingChallenges,
                castingVotes,
                getTopChallenges,
                payoutPlayers,
                getVoters,
                getRewards,
                getMyPacks,
                getMyEarnings
            }}
        >
            {children}
        </ContractContext.Provider>
    );
};
