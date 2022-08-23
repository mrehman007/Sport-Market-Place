import express from 'express';
import { createServer } from 'http';
import { schedule } from 'node-cron';
import { config, connectDB } from './config';
import { configureRoutes } from './routes';
import { configureMiddleware } from './middleware';
import { providers, utils } from 'ethers';
import { User } from './model';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';

// Connect and get reference to db
let db: any;

(async () => {
  db = await connectDB();
})();

// Init express app
const app = express();

// Config Express middleware
configureMiddleware(app);

// Set-up routes
configureRoutes(app);

// Start server and listen for connections
const httpServer = createServer(app);

httpServer.listen(config.PORT || 5000, () => {
  console.info(`Server started on `, httpServer.address());
});

const [HOUR, MINUTE] = config.PROFILE_UPDATE_TIME.split(':');

schedule(
  `${MINUTE} ${HOUR} * * *`,
  async () => {
    console.log(`Getting portfolio values every day at ${HOUR}:${MINUTE}\n---`);
    const provider = new providers.JsonRpcProvider(config.JSON_RPC_URL);

    const sdk = new ThirdwebSDK(provider);
    const playerContract = sdk.getNFTCollection(config.PLAYER_NFT_ADDRESS);
    const players = await playerContract.getAll();

    // Marketplace contract
    const marketplace = sdk.getMarketplace(config.MARKETPLACE_ADDRESS);

    const listings = await marketplace.getAllListings();

    let portfolio: Record<string, any[]> = {};

    // get players portfolio
    listings.forEach(async (listing) => {
      const {
        id: listingId,
        buyoutPrice,
        assetContractAddress,
        tokenId,
        sellerAddress,
        quantity,
        type,
        currencyContractAddress,
      } = listing;

      let listed = portfolio[sellerAddress] || [];

      listed.push({
        listingId: Number(listingId),
        buyoutPrice,
        tokenId,
        assetContractAddress,
        currencyContractAddress,
        quantity,
      });

      portfolio[sellerAddress] = listed;
    });

    // const balances = await Promise.all(
    //   users.map(async (user) => {
    //     const balance = await provider.getBalance(user.address);
    //     return {
    //       user,
    //       balance,
    //     };
    //   })
    // );

    // await Promise.all(
    //   balances.map(async (balance) => {
    //     const user = balance.user;
    //     const ether = utils.formatEther(balance.balance);

    //     // add balance to the list of balances
    //     user.balances.push({
    //       balance: parseFloat(parseFloat(ether).toFixed(6)),
    //       timestamp: new Date().getTime(),
    //       coin: 'ETH',
    //     });

    //     // save user
    //     await user.save();
    //   })
    // );

    console.log('Updated user profiles successfully');
  },
  {
    scheduled: true,
    timezone: 'America/New_York',
  }
);

// Erorr handling - close server if error
// process.on('uncaughtException', (err) => {
//   db.disconnect();

//   console.error(`Error: ${err.message}`);

//   httpServer.close(() => {
//     process.exit(1);
//   });
// });
