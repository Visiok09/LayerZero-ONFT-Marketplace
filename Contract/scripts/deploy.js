const { BigNumber } = require('ethers');
const { ethers } = require('hardhat/internal/lib/hardhat-lib');

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const { name, symbol, minGasToTransfer, lzEndpointAddress, chainID } =
    network.config.deployment;

  const ONFT721 = await hre.ethers.getContractFactory('LZContract');

  const provider = hre.ethers.provider;

  const deploymentTransaction = ONFT721.getDeployTransaction(
    name,
    symbol,
    minGasToTransfer,
    lzEndpointAddress,
    chainID
  );

  const onft721 = await ONFT721.deploy(
    name,
    symbol,
    minGasToTransfer,
    lzEndpointAddress,
    chainID
  );
  await onft721.waitForDeployment();

  console.log('address LZContract', onft721.target);
  console.log(`lzEndpoint ${lzEndpointAddress}, chainId ${chainID}`);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
