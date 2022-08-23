import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { config } from '../config';
import { ethers } from 'ethers';

export const createItem = async () => {
  console.log('Creating Item...');
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const sdk = new ThirdwebSDK(provider.getSigner());
    const contract = sdk.getNFTCollection(config.PLAYER_NFT_ADDRESS);

    // console.log({
    //   role: await contract.roles.getAll(),
    //   granted: await contract.roles.verify(
    //     ["minter"],
    //     "0xB6D48251389644De50736a80F87D8e7cE57F00be"
    //   ),
    // });
    // array from to count
    const players = [
      {
        count: 20,
        image:
          'https://ipfs.io/ipfs/QmVjwYXd4f4qCYCbxkKMkXCcPNm9TrjW6DzjeoDACFRBVj/diamond.png',
        name: 'Diamond',
      },
      {
        count: 20,
        image:
          'https://gateway.pinata.cloud/ipfs/QmVjwYXd4f4qCYCbxkKMkXCcPNm9TrjW6DzjeoDACFRBVj/platinum.png',
        name: 'Platinum',
      },
      {
        count: 20,
        image:
          'https://gateway.pinata.cloud/ipfs/QmVjwYXd4f4qCYCbxkKMkXCcPNm9TrjW6DzjeoDACFRBVj/gold.png',
        name: 'Gold',
      },
      {
        count: 20,
        image:
          'https://gateway.pinata.cloud/ipfs/QmVjwYXd4f4qCYCbxkKMkXCcPNm9TrjW6DzjeoDACFRBVj/silver.png',
        name: 'Silver',
      },
      {
        count: 20,
        image:
          'https://gateway.pinata.cloud/ipfs/QmVjwYXd4f4qCYCbxkKMkXCcPNm9TrjW6DzjeoDACFRBVj/bronze.png',
        name: 'Bronze',
      },
    ];

    for (let i = 0; i < players.length; i++) {
      const player = players[i];
      let data = await contract.mintBatch(
        Array.from(Array(player.count).keys()).map((i) => ({
          name: player.name,
          description: `${player.name} Player`,
          image: player.image,
          attributes: [
            {
              value: player.name.toLowerCase(),
              trait_type: 'type',
            },
          ],
        }))
      );
      console.log(data);
    }
  } catch (err) {
    console.log(err);
  }
};

export const listItem = async () => {
  console.log('Listing Item...');
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const sdk = new ThirdwebSDK(provider.getSigner());
    const market = sdk.getMarketplace(config.MARKETPLACE_ADDRESS);
    let data = await market.direct.createListing({
      assetContractAddress: config.PLAYER_NFT_ADDRESS,
      currencyContractAddress: config.CHAIN_NATIVE_TOKEN_ADDRESS,
      buyoutPricePerToken: '0.1',
      listingDurationInSeconds: 60 * 60 * 24 * 7,
      quantity: 2,
      tokenId: 14,
      startTimeInSeconds: Math.floor(Date.now() / 1000),
    });
    console.log(data);
  } catch (err) {
    console.log(err);
  }
};

export const deployEditionModule = async () => {
  console.log('Deploying Edition Module...');

  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const sdk = new ThirdwebSDK(provider.getSigner());
    const nftCollection = sdk.deployer.deployEdition({
      name: 'Test Edition',
      description: 'Test Edition',
      image: 'https://i.imgur.com/ZqZQZqU.png',
      primary_sale_recipient: `0xB6D48251389644De50736a80F87D8e7cE57F00be`,
      fee_recipient: `0xB6D48251389644De50736a80F87D8e7cE57F00be`,
    });
    console.log(nftCollection);
  } catch (err) {
    console.log(err);
  }
};

export const deployMarketplace = async () => {
  console.log('Deploying Marketplace Module...');

  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const sdk = new ThirdwebSDK(provider.getSigner());
    const nftCollection = sdk.deployer.deployMarketplace({
      name: 'Test Marketplace',
      description: 'Test Marketplace',
      image: 'https://i.imgur.com/ZqZQZqU.png',
      primary_sale_recipient: `0xB6D48251389644De50736a80F87D8e7cE57F00be`,
      fee_recipient: `0xB6D48251389644De50736a80F87D8e7cE57F00be`,
      external_link: 'https://www.google.com',
      platform_fee_basis_points: 5,
      platform_fee_percentage: 0.1,
      platform_fee_recipient: `0xB6D48251389644De50736a80F87D8e7cE57F00be`,
      trusted_forwarders: [`0x695E2B0C032c6c8c6edD92176395571956c0ecee`],
    });
    console.log(nftCollection);
  } catch (err) {
    console.log(err);
  }
};

export const auctionItem = async () => {
  console.log('Auctioning Item...');
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const sdk = new ThirdwebSDK(provider.getSigner());
    const market = sdk.getMarketplace(config.MARKETPLACE_ADDRESS);
    let data = await market.auction.createListing({
      assetContractAddress: config.PLAYER_NFT_ADDRESS,
      buyoutPricePerToken: '0.5',
      currencyContractAddress: config.CHAIN_NATIVE_TOKEN_ADDRESS,
      startTimeInSeconds: Math.floor(Date.now() / 1000),
      listingDurationInSeconds: 60 * 60 * 24,
      tokenId: 9,
      quantity: 2,
      reservePricePerToken: '0.1',
    });
    console.log(data);
  } catch (err) {
    console.log(err);
  }
};

export const getAllItem = async () => {
  console.log('Getting Items...');
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const sdk = new ThirdwebSDK(provider.getSigner());
    const nftCollection = sdk.getNFTCollection(config.PLAYER_NFT_ADDRESS);
    let data = await nftCollection.getAll();
    console.log(data);
  } catch (err) {
    console.log(err);
  }
};

export const unlistItem = async () => {
  console.log('Unlisting Item...');
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const sdk = new ThirdwebSDK(provider.getSigner());
    const market = sdk.getMarketplace(config.MARKETPLACE_ADDRESS);
    await market.cancelDirectListing(3);
    console.log('Unlisted');
  } catch (err) {
    console.log(err);
  }
};

export const grantAdminRole = async (address = '') => {
  console.log(`Granting user ${address} minter role...`);
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const sdk = new ThirdwebSDK(provider.getSigner());
    const nftCollection = sdk.getNFTCollection(config.PLAYER_NFT_ADDRESS);
    console.log({
      nftCollection: nftCollection.address,
    });
    const tx = await nftCollection.roles.grant('minter', address);
    console.log('success', tx);
  } catch (err) {
    console.log(err);
  }
};

export const grantAssetRole = async (address) => {
  console.log(`Granting user ${address} asset role...`);
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const sdk = new ThirdwebSDK(provider.getSigner());
    const marketplace = sdk.getMarketplace(config.MARKETPLACE_ADDRESS);
    console.log({
      marketplace: marketplace.address,
    });
    const tx = await marketplace.roles.grant(
      'asset',
      config.PLAYER_NFT_ADDRESS
    );
    console.log('success', tx);
  } catch (err) {
    console.log(err);
  }
};

export const unlistAuction = async () => {
  console.log('Unlisting Auction...');
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const sdk = new ThirdwebSDK(provider.getSigner());
    const market = sdk.getMarketplace(config.MARKETPLACE_ADDRESS);
    await market.cancelAuctionListing(4);
    console.log('Unlisted');
  } catch (err) {
    console.log(err);
  }
};

export const closeAuction = async () => {
  console.log('Closing Auction...');
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const sdk = new ThirdwebSDK(provider.getSigner());
    const market = sdk.getMarketplace(config.MARKETPLACE_ADDRESS);
    await market.closeAuctionListing(4);
    console.log('Closed');
  } catch (err) {
    console.log(err);
  }
};

export const approve = async () => {
  console.log('Setting Approval...');
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const sdk = new ThirdwebSDK(provider.getSigner());
    const nftCollection = sdk.getNFTCollection(config.PLAYER_NFT_ADDRESS);
    let data = await nftCollection.setApproval(config.PLAYER_NFT_ADDRESS, true);
    console.log(data);
  } catch (err) {
    console.log(err);
  }
};
