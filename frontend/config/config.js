import { Axios } from 'axios';

let defaultConfig = {
  isProduction: process.env.NODE_ENV === 'production',
};

// BACKEND_URL
const REACT_APP_API_URL = defaultConfig.isProduction
  ? 'https://api.pennypusherz.com'
  : `http://localhost:5000`;

const axios = new Axios({
  baseURL: REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export const config = {
  /**
   * Marketplace
   */
  MARKETPLACE_ADDRESS: '0xE499284298BD44E7f317E82F373eb6FB96696528',

  /**
   * Fallback RPC URL
   */
  // FALLBACK_RPC_URL: 'https://rpc-mumbai.matic.today',
  FALLBACK_RPC_URL:
    'https://eth-rinkeby.alchemyapi.io/v2/uyrwOcOFSqOzWgRmmqvdpLDv7Kz2zO_W',

  /**
   * Supported ChAINS IDS
   */
  SUPPORTED_CHAIN_IDS: [80001, 4],

  /**
   * CHAIN NATIVE TOKEN ADDRESS
   */
  CHAIN_NATIVE_TOKEN_ADDRESS: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',

  /**
   * NFT Collection
   */

  PLAYER_NFT_ADDRESS: '0x601dEb228178E20A67014956F38B9e51f5D59658',

  /**
   * VOTING_CRT_ADDRESS
   */
  VOTING_CRT_ADDRESS: '0x0f3203db7f3e505f5d12d96ac3467128e1725ade',

  /**
   * VOTES NFT ADDRESS
   */
  VOTE_NFT_ADDRESS: '0x3C28823491c63B09666B84694F8bBf32918A531A',

  /**
   * MLB_POT_ADDRESS
   */
  MLB_POT_ADDRESS: '0x74940EAd375cb2bB1E21d1B0E7e9916f338c3D5e',
  /**
   * CLUB ITEM ADDRESS
   */
  GAME_ITEM_ADDRESS: '0x05e2255635F8bB95A409dA0c056A7fA6D442c4Eb',

  /**
   * VOUCHER_ADDRESS
   */
  VOUCHER_ADDRESS: '0x8c356516331f597e8deC5D9e035191fde14713aF',

  /**
   * PACK ADDRESS
   */
  PACK_ADDRESS: '0x892f3F5515D7562c4991Ff57556Cd8D6F34c31e4',

  /**
   * WMATIC_ADDRESS
   */
  // WMATIC_ADDRESS: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
  // WMATIC_ADDRESS: '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889',
  WMATIC_ADDRESS: '0xc778417E063141139Fce010982780140Aa0cD5Ab',

  /**
   * AXIOS INSTANCE
   */
  axios,
};
