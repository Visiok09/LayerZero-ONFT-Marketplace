require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config();
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: '0.8.4',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: '0.7.6',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: '0.8.12',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: '0.8.20',
        settings: {
          optimizer: {
            enabled: true,
            runs: 100,
          },
        },
      },
    ],
  },
  networks: {
    sepolia: {
      url: 'https://rpc.ankr.com/eth_sepolia',
      chainId: 11155111,
      accounts: [process.env.PRIVATE_KEY],
      deployment: {
        name: 'LZSEPOLIA',
        symbol: 'LZS',
        minGasToTransfer: 300000000000000,
        lzEndpointAddress: '0xae92d5aD7583AD66E49A0c67BAd18F6ba52dDDc1',
        chainID: 11155111,
      },
    },
    arbSepolia: {
      url: 'https://arbitrum-sepolia.blockpi.network/v1/rpc/public',
      chainId: 421614,
      accounts: [process.env.PRIVATE_KEY],
      deployment: {
        name: 'LZARBAT',
        symbol: 'LZA',
        minGasToTransfer: 300000000000000,
        lzEndpointAddress: '0x6098e96a28E02f27B1e6BD381f870F1C8Bd169d3',
        chainID: 421614,
      },
    },
    optimismSepolia: {
      url: `https://optimism-sepolia.blockpi.network/v1/rpc/public`,
      chainId: 11155420,
      accounts: [process.env.PRIVATE_KEY],
      deployment: {
        name: 'LZOPT',
        symbol: 'LZO',
        minGasToTransfer: 300000000000000,
        lzEndpointAddress: '0x55370E0fBB5f5b8dAeD978BA1c075a499eB107B8',
        chainID: 11155420,
      },
    },
  },
};
