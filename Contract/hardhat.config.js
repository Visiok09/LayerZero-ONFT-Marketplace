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
    blast: {
      url: 'https://blast.blockpi.network/v1/rpc/public',
      chainId: 81457,
      accounts: [process.env.PRIVATE_KEY],
      deployment: {
        name: 'LZBLAST',
        symbol: 'LZBL',
        minGasToTransfer: 300000000000000,
        lzEndpointAddress: '0xb6319cC6c8c27A8F5dAF0dD3DF91EA35C4720dd7',
        chainID: 81457,
      },
    },
    optimism: {
      url: 'https://mainnet.optimism.io',
      chainId: 10,
      accounts: [process.env.PRIVATE_KEY],
      deployment: {
        name: 'OPLZ',
        symbol: 'OLZ',
        minGasToTransfer: 300000000000000,
        lzEndpointAddress: '0x3c2269811836af69497E5F486A85D7316753cf62',
        chainID: 10,
      },
    },
    nova: {
      url: 'https://nova.arbitrum.io/rpc',
      accounts: [process.env.PRIVATE_KEY],
      chainId: 42170,
      deployment: {
        name: 'NOVALZ',
        symbol: 'NLZ',
        minGasToTransfer: 100000000000000,
        lzEndpointAddress: '0x4EE2F9B7cf3A68966c370F3eb2C16613d3235245',
        chainID: 42170,
      },
    },
    base: {
      url: 'https://base.llamarpc.com',
      accounts: [process.env.PRIVATE_KEY],
      chainId: 8453,
      deployment: {
        name: 'BASELZ',
        symbol: 'BLZ',
        minGasToTransfer: 100000000000000,
        lzEndpointAddress: '0x3c2269811836af69497E5F486A85D7316753cf62',
        chainID: 8453,
      },
    },
    linea: {
      url: 'https://linea.drpc.org',
      chainId: 59144,
      accounts: [process.env.PRIVATE_KEY],
      deployment: {
        name: 'LINEALZ',
        symbol: 'LLZ',
        minGasToTransfer: 300000000000000,
        lzEndpointAddress: '0xb6319cC6c8c27A8F5dAF0dD3DF91EA35C4720dd7',
        chainID: 59144,
      },
    },
    zkevm: {
      url: 'https://zkevm-rpc.com	',
      chainId: 1101,
      accounts: [process.env.PRIVATE_KEY],
      deployment: {
        name: 'ZKEVMLZ',
        symbol: 'ZKLZ',
        minGasToTransfer: 300000000000000,
        lzEndpointAddress: '0x9740FF91F1985D8d2B71494aE1A2f723bb3Ed9E4',
        chainID: 1101,
      },
    },
    manta: {
      url: `https://pacific-rpc.manta.network/http`,
      chainId: 169,
      accounts: [process.env.PRIVATE_KEY],
      deployment: {
        name: 'LZMANTA',
        symbol: 'LZM',
        minGasToTransfer: 300000000000000,
        lzEndpointAddress: '0xb6319cC6c8c27A8F5dAF0dD3DF91EA35C4720dd7',
        chainID: 169,
      },
    },
  },
};
