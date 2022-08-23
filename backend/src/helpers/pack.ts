import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { providers, Wallet } from 'ethers';
import { config } from '../config';

const deployPack = async () => {
  const provider = new providers.JsonRpcProvider(config.JSON_RPC_URL);

  const signer = new Wallet(config.PRIVATE_KEY!, provider);

  const sdk = new ThirdwebSDK(signer);

  const packAddress = await sdk.deployer.deployPack({
    name: 'Test Pack',
    description: 'Test Pack Description',
    primary_sale_recipient: await signer.getAddress(),
  });

  console.log(`Pack deployed at ${packAddress}`);
};

deployPack();
