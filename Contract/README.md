This repository provides example of deploying a contract using Hardhat.
### Prerequisites

Node.js installed on your machine


### Clone this repository:

`git clone https://github.com/Visiok09/LayerZero-ONFT-Marketplace`

`cd Contract`

### Install dependencies:

`npm install`

### Create a .env file in the root directory:

Disclaimer: It is not recommended to use .env files in production environments. They should only be utilized during the development stage for managing sensitive information like project IDs, secret keys, and other credentials. It's crucial to employ secure and industry-standard methods for managing environment variables in production settings to prevent unauthorized access to sensitive data.

`touch .env`

### Add your private key to the .env file:

`PRIVATE_KEY=your_private_key_here`

Note: Replace your_private_key_here with your actual private key. Be sure to keep this private key secure and do not share it.

# Usage

1. Compile the Contract

`npx hardhat compile`

2. Setting the hardhat config

Open the `hardhat.config.js` file and add youe networks setting and constructor arguments, for example:

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
}
}

- `sepolia`: name of the network
- `url`: RPC URL for the network where you want to deploy
- `chainId`: current Chain ID of the network
- `accounts`: An array containing your private key (stored in .env file)
- `deployment`: Object containing contract arguments
- `name`: Token name
- `symbol`: Token symbol
- `minGasToTransfer`: : The minimum gas needed to transfer and store NFT. Please refer to LayerZero documentation for the correct value.
- `lzEndpointAddress`: The LayerZero endpoint address on which network you are deploying the contract. In this example, we are deploying to the sepolia network, so you need to get the sepolia endpoint address. Refer to LayerZero documentation for the correct address.

### Deploy the Contract

- Run the following command to deploy the contract to the configured network (in this case, "sepolia"):

`npx hardhat run scripts/deploy.js --network sepolia`

### Interact with the Contract

- After successfully deployed contracts you need to set trusted remote address , please refer to LayerZero documentation.`https://layerzero.gitbook.io/docs/evm-guides/master/set-trusted-remotes`

- Open the `setTrustedAddr.js` and fill in the appropriate fields where:
- `const SEPOLIA` = LayerZero endpoint Id in our case this is for Sepolia = `10161`
- `const ARBITRUM ` = LayerZero endpoint Id in our case this is for Arbitrum Sepolia = `10231`
- `const contractAddressSepolia` = Deployed contract address on the Sepolia network
- `const contractAddressArbiSep` = Deployed contract address on the Arbitrum Sepolia network

Then run command to setTrustedRemote adrress:

`npx hardhat run scripts/setTrustedAddr.js --network sepolia`
`npx hardhat run scripts/setTrustedAddr.js --network arbitrumSepolia`

After successfully linked your contracts , copy contracts address and go to `cd Frontend` folder and follow the description.

## Contributing

We welcome contributions from the community! If you'd like to contribute to this project, please follow these guidelines:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/new-feature`).
3. Make your changes.
4. Commit your changes (`git commit -am 'Add new feature'`).
5. Push to the branch (`git push origin feature/new-feature`).
6. Create a new Pull Request.

## Issues

If you encounter any issues with the project, please [open an issue](https://github.com/Visiok09/LayerZero-ONFT-Marketplace) on GitHub.
