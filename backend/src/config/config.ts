import 'dotenv/config';

/// @dev Validate required environment variables
if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  throw new Error(
    'Please make sure you have a MONGO_URI and JWT_SECRET in your .env file'
  );
}

export const config = {
  /**
   * PRIVATE_KEY is the private key of the account that will be used to sign the transactions
   */
  PRIVATE_KEY: process.env.PRIVATE_KEY,
  /**
   * @notice Database configuration
   */
  MONGO_URI: process.env.MONGO_URI!,

  /**
   * @notice Server configuration
   * @dev This is the port that the server will be ruchrnning on
   */
  PORT: process.env.PORT,

  /**
   * @notice JWT configuration
   * @dev This is the secret key that will be used to sign the JWT
   */
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_TOKEN_EXPIRES_IN: 3600000 * 24 * 7, // 7 days

  /**
   * JSON RPC configuration
   */
  // JSON_RPC_URL: `https://matic-mumbai.chainstacklabs.com`,
  JSON_RPC_URL: `https://eth-rinkeby.alchemyapi.io/v2/uyrwOcOFSqOzWgRmmqvdpLDv7Kz2zO_W`,

  /**
   * @notice Profile update time
   */
  PROFILE_UPDATE_TIME: '02:02',

  /**
   * Marketplace
   */
  MARKETPLACE_ADDRESS: '0x631bCAdFe4b29ef2132eC306cA50087eE7afCb34',
  /**
   * NFT Collection
   */

  PLAYER_NFT_ADDRESS: '0x7D8f3f0198A79DCb28BDa5461d7Bd37F7861F7FA',

  /**
   * VOTING_CRT_ADDRESS
   */
  VOTING_CRT_ADDRESS: '0x0f3203db7f3e505f5d12d96ac3467128e1725ade',

  /**
   * VOTES NFT ADDRESS
   */
  VOTING_NFT_ADDRESS: '0xf57F418b79b141CC4C4Cf37063468efF14e69245',

  /**
   * MLB_POT_ADDRESS
   */
  MLB_POT_ADDRESS: '0x74940EAd375cb2bB1E21d1B0E7e9916f338c3D5e',
  /**
   * CLUB ITEM ADDRESS
   */
  CLUB_ITEM_ADDRESS: '0x74940EAd375cb2bB1E21d1B0E7e9916f338c3D5e',

  /**
   * VOUCHER_ADDRESS
   */
  VOUCHER_ADDRESS: '0x74940EAd375cb2bB1E21d1B0E7e9916f338c3D5e',
};
