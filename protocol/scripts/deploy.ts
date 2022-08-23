import hre, { ethers, upgrades } from "hardhat";

async function verify(address: string, args: any[]) {
  try {
    return await hre.run("verify:verify", {
      address: address,
      constructorArguments: args,
    });
  } catch (e) {
    console.log(address, args, e);
  }
}

async function main() {
  const [defaultAdmin] = await hre.ethers.getSigners();

  // const Voting = await ethers.getContractFactory("Voting");

  // const voting = await upgrades.deployProxy(Voting, [defaultAdmin.address], {
  //   initializer: "initialize",
  // });

  // await voting.deployed();
  // console.log("Deploying Voting at tx: ", voting.deployTransaction.hash);
  // // const voting = await ethers.getContractAt(
  // //   "Voting",
  // //   "0xc38b9aD8Cf9172f88eaA28A3fC0204a2dbD6004D"
  // // );

  // // console.log("Voting address: ", voting.address);

  const Marketplace = await ethers.getContractFactory("Marketplace");
  const marketplace = await Marketplace.deploy(
    "0xc778417E063141139Fce010982780140Aa0cD5Ab",
    "0x8C4B615040Ebd2618e8fC3B20ceFe9abAfdEb0ea"
  );
  console.log(
    "Deploying Marketplace at tx: ",
    marketplace.deployTransaction.hash
  );
  console.log("Marketplace address: ", marketplace.address);

  await marketplace.initialize(
    await defaultAdmin.getAddress(),
    "ipfs://QmexcpGG2b2CSbBECvpuqMFFQy5391dMbTNnEj6khU5DRJ/0",
    ["0xFD4973FeB2031D4409fB57afEE5dF2051b171104"],
    await defaultAdmin.getAddress(),
    0
  );
  marketplace.deployed();

  console.log("Marketplace initialized");

  // const Pot = await ethers.getContractFactory("Pot");

  // const pot = await upgrades.deployProxy(Pot, [defaultAdmin.address], {
  //   initializer: "initialize",
  // });

  // await pot.deployed();
  // console.log("Deploying Pot at tx: ", pot.deployTransaction.hash);
  // // const pot = await ethers.getContractAt(
  // //   "Pot",
  // //   "0xc38b9aD8Cf9172f88eaA28A3fC0204a2dbD6004D"
  // // );

  // console.log("Pot address: ", pot.address);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
