import React, { useState, useEffect } from 'react';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import Web3 from 'web3';
import axios from 'axios';
import { create as ipfsHttpClient } from 'ipfs-http-client';
import * as zksync from 'zksync-web3';
import { Wallet, Provider } from 'zksync-web3';

import config from './config.json';

import ONFT from './onft.json';

import { storeUserPoint } from '../graphql/storeUser';
import {
  saveWalletInfoToLocalStorage,
  getWalletInfoFromLocalStorage,
  getNetworkFromLocalStorage,
  saveNetworkToLocalStorage,
} from './walletStorage';

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
const projectSecret = process.env.NEXT_PUBLIC_SECRECT_KEY;

const auth = `Basic ${Buffer.from(`${projectId}:${projectSecret}`).toString(
  'base64'
)}`;

const client = ipfsHttpClient({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth,
  },
});

export const NFTContext = React.createContext();

export const NFTProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState('');
  const [network, setNetwork] = useState(false);
  const [isLoadingNFT, setIsLoadingNFT] = useState(false);
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);
  const [marketContract, setMarketContract] = useState([]);
  const [currentChainId, setCurrentChain] = useState(null);
  const [saleCancelled, setSaleCancelled] = useState([]);
  const [creatingNft, setCreatingNft] = useState(false);
  const [signature, setSignature] = useState(null);
  const [nftCurrency, setNftCurrency] = useState('ETH');
  const [walletConnected, setWalletConnected] = useState(false);
  const [userPoint, setUserPoint] = useState(0);
  const CONF = config;
  const nftsPerPage = 15;
  const ABIMARKET = ONFT.abi;
  const [selectedChainName, setSelectedChainName] = useState('Networks');

  //CONNECT WALLET
  const connectWallet = async () => {
    if (!window.ethereum) {
      console.log('Please install MetaMask for using our NFT platform!');
      return;
    }

    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);

    if (provider) {
      setIsMetaMaskInstalled(true);
      const accounts = await window.ethereum.request({
        method: 'eth_accounts',
      });

      if (accounts.length) {
        try {
          await checkNetwork();
          setWalletConnected(true);
          setCurrentAccount(accounts[0]);

          // Save wallet info to local storage
          saveWalletInfoToLocalStorage(true, accounts[0]);

          console.log('Wallet connected:', accounts[0]);
        } catch (error) {
          console.log(error);
        }
      } else {
        console.log('No accounts found.');
      }
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('chainChanged', async () => {});

      window.ethereum.on('accountsChanged', () => {
        if (walletConnected) {
          window.location.reload();
        }
      });
    }
  }, [currentAccount, currentChainId]);

  const targetChainId = [
    11155111, 168587773, 42170, 534352, 324, 10, 8453, 59144, 1101, 204, 169,
  ];
  const defaultChainId = 324;
  //CHECK NETWORK
  const checkNetwork = async () => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const { chainId } = await provider.getNetwork();

    if (targetChainId.includes(chainId)) {
      console.log('chainId', chainId);
      setCurrentChain(chainId);
      saveNetworkToLocalStorage(chainId, '');
      setNetwork(true);
      return chainId;
    } else {
      console.log('error from checkNetwork');
      const web3 = new Web3();
      if (window.ethereum.networkVersion !== defaultChainId) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: web3.utils.toHex(defaultChainId) }],
          });
          saveNetworkToLocalStorage(defaultChainId, 'zkSync Era');
          setCurrentChain(defaultChainId);
          //setSelectedChainName('zkSync Era');
        } catch (err) {
          // This error code indicates that the chain has not been added to MetaMask
          if (err.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainName: 'zkSync Mainnet',
                  chainId: web3.utils.toHex(defaultChainId),
                  nativeCurrency: { name: 'ETH', decimals: 18, symbol: 'ETH' },
                  rpcUrls: ['https://mainnet.era.zksync.io'],
                },
              ],
            });
          }
        }
      }
    }
  };

  //FETCH NFTS
  const fetchNFTs = async (currentPage) => {
    setIsLoadingNFT(false);

    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    let provider;

    if (currentChainId === 324) {
      provider = new Provider('https://mainnet.era.zksync.io');
    } else {
      provider = new ethers.providers.Web3Provider(connection);
    }

    const MARKETADDR = CONF[currentChainId]?.['market']?.['address'];

    const contract = new ethers.Contract(MARKETADDR, ABIMARKET, provider);

    const data = await contract.fetchMarketItems();

    const items = await Promise.all(
      data.map(
        async ({
          tokenId,
          seller,
          owner,
          price: unformattedPrice,
          creationTimestamp,
        }) => {
          const tokenURI = await contract.tokenURI(tokenId);
          const {
            data: { image, name, description },
          } = await axios.get(tokenURI);
          const price = ethers.utils.formatUnits(
            unformattedPrice.toString(),
            'ether'
          );

          return {
            price,
            tokenId: tokenId.toNumber(),
            seller,
            owner,
            name,
            image,
            description,
            tokenURI,
            creationTimestamp: creationTimestamp.toNumber(),
          };
        }
      )
    );

    const sortedItems = items.sort(
      (a, b) => b.creationTimestamp - a.creationTimestamp
    );

    const startIndex = (currentPage - 1) * nftsPerPage;
    const endIndex = startIndex + nftsPerPage;
    const itemsToShow = sortedItems.slice(startIndex, endIndex);

    setIsLoadingNFT(false);
    return itemsToShow;
  };

  //fetch mynfts
  const fetchMyNfts = async (currentPage) => {
    setIsLoadingNFT(false);

    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);

    const signer = provider.getSigner();

    const MARKETADDR = CONF[currentChainId]?.['market']?.['address'];
    const contract = new ethers.Contract(MARKETADDR, ABIMARKET, signer);
    const data = await contract.fetchMyNFTs();
    const items = await Promise.all(
      data.map(
        async ({
          tokenId,
          seller,
          owner,
          price: unformattedPrice,
          // creationTimestamp,
        }) => {
          const tokenURI = await contract.tokenURI(tokenId);
          const {
            data: { image, name, description },
          } = await axios.get(tokenURI);
          const price = ethers.utils.formatUnits(
            unformattedPrice.toString(),
            'ether'
          );

          return {
            price,
            tokenId: tokenId.toNumber(),
            seller,
            owner,
            name,
            image,
            description,
            tokenURI,
            // creationTimestamp: creationTimestamp.toNumber(),
          };
        }
      )
    );

    //const sortedItems = items.sort((a, b) => b.tokenId - a.tokenId);
    const sortedItems = items.sort(
      (a, b) => b.creationTimestamp - a.creationTimestamp
    );
    const startIndex = (currentPage - 1) * nftsPerPage;
    const endIndex = startIndex + nftsPerPage;
    const itemsToShow = sortedItems.slice(startIndex, endIndex);

    setIsLoadingNFT(false);
    return itemsToShow;
  };

  //FETCH MYORLISTEDNFTS
  const fetchMyNFTsOrListedNFTs = async (currentPage) => {
    setIsLoadingNFT(false);
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const MARKETADDR = CONF[currentChainId]?.['market']?.['address'];

    const contract = new ethers.Contract(MARKETADDR, ABIMARKET, signer);

    const data = await contract.fetchItemsListed();

    const items = await Promise.all(
      data.map(
        async ({
          tokenId,
          seller,
          owner,
          price: unformattedPrice,
          creationTimestamp,
        }) => {
          const tokenURI = await contract.tokenURI(tokenId);
          const {
            data: { image, name, description },
          } = await axios.get(tokenURI);
          const price = ethers.utils.formatUnits(
            unformattedPrice.toString(),
            'ether'
          );

          return {
            price,
            tokenId: tokenId.toNumber(),
            seller,
            owner,
            name,
            image,
            description,
            tokenURI,
            creationTimestamp: tokenId.toNumber(),
          };
        }
      )
    );

    // const sortedItems = items.sort((a, b) => b.tokenId - a.tokenId);
    const sortedItems = items.sort(
      (a, b) => b.creationTimestamp - a.creationTimestamp
    );

    const startIndex = (currentPage - 1) * nftsPerPage;
    const endIndex = startIndex + nftsPerPage;
    const itemsToShow = sortedItems.slice(startIndex, endIndex);

    setIsLoadingNFT(false);
    return itemsToShow;
  };
  //FETCH TOPSELLER
  const fetchTopSeller = async (_seller, currentPage) => {
    setIsLoadingNFT(false);
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const contract = await fetchContract(signer);

    const data = await contract.fetchSellerNFTs(_seller);

    const items = await Promise.all(
      data.map(async ({ tokenId, seller, owner, price: unformattedPrice }) => {
        const tokenURI = await contract.tokenURI(tokenId);
        const {
          data: { image, name, description },
        } = await axios.get(tokenURI);
        const price = ethers.utils.formatUnits(
          unformattedPrice.toString(),
          'ether'
        );

        return {
          price,
          tokenId: tokenId.toNumber(),
          seller,
          owner,
          name,
          image,
          description,
          tokenURI,
          creationTimestamp,
        };
      })
    );
    // const sortedItems = items.sort((a, b) => b.tokenId - a.tokenId);

    const sortedItems = items.sort(
      (a, b) => b.creationTimestamp - a.creationTimestamp
    );

    const startIndex = (currentPage - 1) * nftsPerPage;
    const endIndex = startIndex + nftsPerPage;
    const itemsToShow = sortedItems.slice(startIndex, endIndex);

    setIsLoadingNFT(false);
    return itemsToShow;
  };

  //FETCH CONTRACT
  const fetchContract = async (signerOrProvider) => {
    if (currentChainId) {
      const MARKETADDR = CONF[currentChainId]?.market.address;

      const contractInstance = new ethers.Contract(
        MARKETADDR,
        ABIMARKET,
        signerOrProvider
      );

      setMarketContract(contractInstance);

      return contractInstance;
    } else {
      console.log('error form fetchcontract');
    }
  };
  //UPLOAD TO IPFS
  const uploadToIPFS = async (file) => {
    try {
      const added = await client.add({ content: file });

      const url = `yoursubdomain.infura-ipfs.io/ipfs/${added.path}`;

      return url;
    } catch (error) {
      console.log('Error uploading file to IPFS.');
      console.log(error);
    }
  };
  //CREATE NFT
  const createNFT = async (formInput, fileUrl, router) => {
    const { name, description, price } = formInput;

    if (!name || !description || !price || !fileUrl) return;

    const data = JSON.stringify({ name, description, image: fileUrl });

    try {
      const added = await client.add(data);

      const url = `yoursubdomain.infura-ipfs.io/ipfs/${added.path}`;

      await createSale(url, price);

      router.push('/my-nfts');
    } catch (error) {
      console.log('Error uploading file to IPFS.');
      console.log(error);
    }
  };
  //CREATE SALE
  const createSale = async (url, formInputPrice, isReselling, id) => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const price = ethers.utils.parseUnits(formInputPrice, 'ether');

    const MARKETADDR = CONF[currentChainId]?.market.address;

    const contract = new ethers.Contract(MARKETADDR, ABIMARKET, signer);

    const listingPriceInEther = 0.0001;
    const listingPriceInWei = ethers.utils.parseEther(
      listingPriceInEther.toString()
    );

    const transaction = !isReselling
      ? await contract.createToken(url, price, {
          value: listingPriceInWei.toString(),
        })
      : await contract.resellToken(id, price);

    setIsLoadingNFT(true);
    await transaction.wait();
  };
  //Cancel SALE
  const cancelSale = async (tokenId) => {
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = await fetchContract(signer);

      const transaction = await contract.cancelListing(tokenId);

      setIsLoadingNFT(true);
      await transaction.wait();
    } catch (error) {
      console.log(error);
    }
  };
  //HandleCancellation
  const handleCancellation = async (tokenId, currentPage) => {
    await cancelSale(tokenId);

    const updatedNFTs = await fetchMyNFTsOrListedNFTs(
      'fetchItemsListed',
      currentPage
    );
    const filteredNFTs = updatedNFTs.filter((item) => item.tokenId !== tokenId);
    setSaleCancelled(filteredNFTs);

    setIsLoadingNFT(false);
  };

  const buyNFT = async (nft) => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const MARKETADDR = CONF[currentChainId]?.market.address;

    const contract = new ethers.Contract(MARKETADDR, ABIMARKET, signer);

    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether');

    const listingPriceInEther = 0.00005;
    const listingPriceInWei = ethers.utils.parseEther(
      listingPriceInEther.toString()
    );
    const totalAmountWei = price.add(listingPriceInWei);

    const transaction = await contract.createMarketSale(nft.tokenId, {
      value: totalAmountWei,
    });

    setIsLoadingNFT(true);
    await transaction.wait();
    setIsLoadingNFT(false);
  };

  const bridgeNft = async (chainToBridge, tokenid) => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const MARKET_ADDRESS = CONF[currentChainId]?.market.address;
    const contract = new ethers.Contract(MARKET_ADDRESS, ABIMARKET, signer);

    let _dstChain = chainToBridge;
    let _tokenId = tokenid;
    const signerAddress = await signer.getAddress();
    //console.log(signerAddress, _dstChain, _tokenId);
    const bytesAddress = ethers.utils.arrayify(signerAddress);

    let EstimateAdapter = ethers.utils.solidityPack(
      ['uint16', 'uint'],
      [1, 350000]
    );

    const [nativeFee, zroFee] = await contract.estimateSendFee(
      _dstChain,
      bytesAddress,
      _tokenId,
      false,
      EstimateAdapter
    );

    const nativeFeeInEther = ethers.utils.formatEther(nativeFee);

    const lzCommissionInWei = ethers.utils.parseEther(
      nativeFeeInEther.toString()
    );

    const addPrice = 0.00003;
    const addPriceInWei = ethers.utils.parseEther(addPrice.toString());

    const appPriceInEther = 0.0001;
    const listingPriceInWei = ethers.utils.parseEther(
      appPriceInEther.toString()
    );

    const transaction = await contract.sendOnft(
      chainToBridge,
      tokenid,
      EstimateAdapter,
      {
        value: listingPriceInWei.add(lzCommissionInWei).add(addPriceInWei),
      }
    );
    await transaction.wait();
  };

  const value = {
    bridgeNft,
    nftCurrency,
    currentChainId,
    fetchMyNfts,
    fetchTopSeller,
    connectWallet,
    currentChainId,
    marketContract,
    handleCancellation,
    currentAccount,
    uploadToIPFS,
    createNFT,
    fetchNFTs,
    fetchMyNFTsOrListedNFTs,
    buyNFT,
    createSale,
    cancelSale,
    setIsLoadingNFT,
    network,
    isMetaMaskInstalled,
    CONF,
    ABIMARKET,
    walletConnected,
    setWalletConnected,
    setCurrentAccount,
    setNetwork,
    userPoint,
    setUserPoint,
    setCurrentAccount,
    setCurrentChain,
    selectedChainName,
    setSelectedChainName,
    nftsPerPage,
  };

  return <NFTContext.Provider value={value}>{children}</NFTContext.Provider>;
};
