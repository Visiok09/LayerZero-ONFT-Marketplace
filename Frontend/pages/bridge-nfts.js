import { useState, useEffect, useContext, useRef } from 'react';
import Image from 'next/image';
import { BiCog } from 'react-icons/bi';
import { useTheme } from 'next-themes';
import { NFTContext } from '../context/NFTContext';
import { useRouter } from 'next/router';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import {
  Loader,
  Button,
  Modal,
  NFTCard,
  Banner,
  SearchBar,
} from '../components';
import images from '../assets';
import BridgeCard from '../components/BridgeCard';
import BridgeChains from '../components/ChainId/BridgeChains';
import ChainId from '../components/ChainId/ChainId';

const BridgeNFTs = () => {
  const {
    fetchMyNFTsOrListedNFTs,
    currentAccount,
    currentChainId,
    fetchMyNfts,
    bridgeNft,
    CONF,
    ABIMARKET,
  } = useContext(NFTContext);
  const [nfts, setNfts] = useState([]);
  const [nftsCopy, setNftsCopy] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSelect, setActiveSelect] = useState('Recently Added');
  const [currentPage, setCurrentPage] = useState(1);
  const [loadMore, setLoadMore] = useState(false);
  const [hasMoreItems, setHasMoreItems] = useState(true);
  const parentRef = useRef(null);
  const scrollRef = useRef(null);
  const selectorRef = useRef(null);
  const [hideButtons, setHideButtons] = useState(false);
  const { theme } = useTheme();
  const [selectedBridgeName, setSelectedBridgeName] = useState('Networks');
  const [bridgeNetworkNotify, setBridgeNetworkNotify] = useState(false);
  const [chainToBridge, setChainToBridge] = useState('');
  const [tokenid, setTokenid] = useState('');
  const [sendingModal, setSendingModal] = useState(false);
  const [SuccessfullySend, setSuccessfullySend] = useState(false);
  const [currentNFT, setCurrentNFT] = useState(null);
  const router = useRouter();

  const [currentChainName, setCurrentChainName] =
    useState('the selected chain');

  const [errorSend, setErrorSend] = useState(false);

  const [checkFee, setCheckFee] = useState(false);

  const [networkFees, setNetworkFees] = useState('');

  const handleBridge = async () => {
    if (chainToBridge !== '' && tokenid !== '') {
      try {
        setSendingModal(true);
        await bridgeNft(chainToBridge, tokenid);
        setSendingModal(false);
        setSuccessfullySend(true);
        setTokenid('');
        setSelectedBridgeName('Networks');
        setChainToBridge('');
      } catch (error) {
        setSendingModal(false);
        setErrorSend(true);
        setTokenid('');
        setSelectedBridgeName('Networks');
        setChainToBridge('');
        console.log(error);
      }
    }
  };

  const handleCardClick = (nft) => {
    setCurrentNFT(nft);
    setTokenid(nft.tokenId);

    if (window.history.pushState) {
      // This will create a new entry in the browser's history, without reloading the page
      window.history.pushState(null, null, `?tokenId=${nft.tokenId}`);
    } else {
      // Fallback for older browsers
      window.location.hash = `tokenId=${nft.tokenId}`;
    }
  };

  const onChangeBrigeChain = async (chainName, e) => {
    // console.log(chainName);
    setSelectedBridgeName(chainName);
    setCurrentChainName(chainName);
    setChainToBridge(e);
    // handleNetworkFee(e);
    localStorage.setItem('selectedBridgeName', chainName);
    calculateFee();
  };

  // console.log(currentAccount);

  const calculateFee = async () => {
    if (chainToBridge !== '' && tokenid !== '') {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();

      const MARKET_ADDRESS = CONF[currentChainId]?.market.address;
      const contract = new ethers.Contract(MARKET_ADDRESS, ABIMARKET, signer);

      let _dstChain = chainToBridge;
      let _tokenId = tokenid;
      const signerAddress = await signer.getAddress();
      // console.log(signerAddress, _dstChain, _tokenId);
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
      const addPrice = 0.00003;
      const addPriceInWei = ethers.utils.parseEther(addPrice.toString());

      const appPriceInEther = 0.0001;
      const listingPriceInWei = ethers.utils.parseEther(
        appPriceInEther.toString()
      );

      const nativeFeeInEther = ethers.utils.formatEther(nativeFee);
      const lzfees = (
        parseFloat(addPrice) +
        parseFloat(appPriceInEther) +
        parseFloat(nativeFeeInEther)
      ).toFixed(5);

      setNetworkFees(lzfees);
    }
  };
  useEffect(() => {
    calculateFee(); // Call calculateFee function
  }, [chainToBridge]);

  // useEffect(() => {
  //   setCurrentChainName(selectedBridgeName);
  // }, [selectedBridgeName]);

  const openBridgeNetwork = () => {
    setBridgeNetworkNotify(!bridgeNetworkNotify);
  };

  // const hideNetwork = () => {
  //   setBridgeNetworkNotify(false);
  // };

  const handleDocumentClick = (event) => {
    // Check if the click event occurred outside the selector component
    if (selectorRef.current && !selectorRef.current.contains(event.target)) {
      setBridgeNetworkNotify(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleDocumentClick);
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);

  useEffect(async () => {
    if (currentAccount && currentChainId) {
      const initialNfts = await fetchMyNfts(currentPage);
      setNfts(initialNfts);
      // setNftsCopy(initialNfts);
      setIsLoading(false);
    }
  }, [currentChainId, currentAccount, SuccessfullySend]);

  const handleScroll = (direction) => {
    const { current } = scrollRef;

    const scrollAmount = window.innerWidth > 300 ? 270 : 210;

    if (direction === 'left') {
      current.scrollLeft -= scrollAmount;
    } else {
      current.scrollLeft += scrollAmount;
    }
  };

  const isScrollable = () => {
    const { current } = scrollRef;
    const { current: parent } = parentRef;

    if (current?.scrollWidth >= parent?.offsetWidth) {
      setHideButtons(false);
    } else {
      setHideButtons(true);
    }
  };

  useEffect(() => {
    isScrollable();
    window.addEventListener('resize', isScrollable);

    return () => {
      window.removeEventListener('resize', isScrollable);
    };
  });

  if (isLoading) {
    return (
      <div className="flexStart min-h-screen">
        <Loader />
      </div>
    );
  }
  return (
    <div className="bridge">
      <div className="para">
        <h1>
          <b>BettaBridge.</b>
        </h1>
        {/* <Image
          style={{ marginTop: '10px' }}
          src={images.lz}
          alt="nova"
          width={35}
          height={35}
        /> */}
      </div>
      <div className="nftToBridge">
        {!isLoading && !nfts.length && !nftsCopy.length ? (
          <div>
            <h1 style={{ fontSize: '40px', marginLeft: '30px' }}>
              <span className="font-semibold text-success-color">
                {' '}
                You don't own nft's to send
              </span>
            </h1>
          </div>
        ) : (
          <div className="relative flex-1 max-w-full flex mt-3" ref={parentRef}>
            <div
              className="flex flex-row w-max overflow-x-scroll no-scrollbar select-none"
              ref={scrollRef}
            >
              <div className="nft">
                {nfts.map((nft) => (
                  <BridgeCard
                    key={nft.tokenId}
                    nft={nft}
                    onProfilePage
                    onCardClick={() => handleCardClick(nft)}
                  />
                ))}
                {!hideButtons && (
                  <>
                    <div
                      onClick={() => handleScroll('left')}
                      className="absolute w-8 h-8 minlg:w-12 minlg:h-12 top-45 cursor-pointer left-0"
                    >
                      <Image
                        src={images.left}
                        layout="fill"
                        objectFit="contain"
                        alt="left_arrow"
                        className={theme === 'light' ? 'filter invert' : ''}
                      />
                    </div>
                    <div
                      onClick={() => handleScroll('right')}
                      className="absolute w-8 h-8 minlg:w-12 minlg:h-12 top-45 cursor-pointer right-0"
                    >
                      <Image
                        src={images.right}
                        layout="fill"
                        objectFit="contain"
                        alt="left_arrow"
                        className={theme === 'light' ? 'filter invert' : ''}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="current-nft">
        <div className="flex ">
          Token ID:
          <span style={{ marginLeft: '10px' }}>
            <span className="font-semibold text-success-color">{tokenid}</span>
            {/* <b>{tokenid}</b> */}
          </span>
        </div>
        <div className="flex ">
          <span>Destination chain:</span>
          <div style={{ marginLeft: '10px' }}>
            <div className="selector-bridge" ref={selectorRef}>
              <div onClick={() => openBridgeNetwork()}>
                {selectedBridgeName}
              </div>
            </div>
            {bridgeNetworkNotify && (
              <BridgeChains onChangeBrigeChain={onChangeBrigeChain} />
            )}
          </div>
        </div>
        {/* <div className="flex">
          Transfer to:
          <div style={{ marginLeft: '10px' }}>
            {' '}
            <div className="selector" ref={selectorRef}>
              <div id="selectField" onClick={() => openBridgeNetwork()}>
                {selectedBridgeName}
              </div>
            </div>
            {bridgeNetworkNotify && (
              <BridgeChains
                // onMouseLeave={() => hideNetwork()}
                onChangeBrigeChain={onChangeBrigeChain}
              />
            )}
          </div>
        </div> */}
      </div>
      {sendingModal && (
        <Modal
          header="Sending NFT ..."
          body={
            <div className="flexCenter flex-col text-center">
              <div className="relative w-52 h-52">
                {/* <h2>Please confirm in your wallet</h2> */}
                <Loader />
              </div>
            </div>
          }
          handleClose={() => {
            setSendingModal(false);
          }}
        />
      )}
      {SuccessfullySend && (
        <Modal
          header="Done!"
          body={
            <div
              className="flexCenter flex-col text-center"
              // onClick={() => setSuccessModal(false)}
            >
              <div className="relative w-52 h-52">
                <Image src={currentNFT.image} objectFit="cover" layout="fill" />
              </div>
              <p className="font-poppins dark:text-white text-nft-black-1 font-normal text text-sm minlg:text-xl mt-10">
                <span className="font-semibold text-success-color">
                  <span className="text-white"> You successfully send </span>{' '}
                  {currentNFT.name}
                  <span className="text-white"> to </span>
                  <span className="font-semibold text-success-color">
                    {' '}
                    {currentChainName}
                  </span>
                </span>
                {/* {`  ${currentNFT.name} to ${currentChainName}`}{' '} */}
                {/* {currentNFT.name} */}
                {/* <span className="text-white"> from</span>
                  <span className="font-semibold text-success-color">
                    {' '}
                    {shortenAddress(nft.seller)}
                  </span> */}
              </p>
            </div>
          }
          footer={
            <div className="flexCenter flex-col">
              <Button
                btnName="Check your NFTs"
                classStyles="sm:mb-5 rounded-xl sm:mr-0"
                handleClick={() => router.push('/my-nfts')}
              />
            </div>
          }
          handleClose={() => setSuccessfullySend(false)}
        />
      )}
      {errorSend && (
        <Modal
          header="Something went wrong"
          body={
            <div
              className="flexCenter flex-col text-center"
              // onClick={() => setSuccessModal(false)}
            >
              <div className="relative w-52 h-52">
                <Image src={images.error} objectFit="cover" layout="fill" />
              </div>
              {/* <p className="font-poppins dark:text-white text-nft-black-1 font-normal text text-sm minlg:text-xl mt-10">
                You successfully send
                <span className="font-semibold text-success-color">
                  {' '}
                  {currentNFT.name}
                  <span className="text-white"> to </span>
                  <span className="font-semibold text-success-color">
                    {' '}
                    {currentChainName}
                  </span>
                </span>
              </p> */}
            </div>
          }
          handleClose={() => setErrorSend(false)}
        />
      )}
      <button onClick={handleBridge} className="bridgeNft">
        <b>Send</b>
      </button>
      <div style={{ display: 'flex' }}>
        {/* <BiCog
          style={{ width: '30', height: '25px', cursor: 'pointer' }}
          onClick={handleCheckFee}
        /> */}
        Networks fees :
        <span
          style={{ marginLeft: '5px' }}
          className="font-semibold text-success-color"
        >
          {networkFees}
        </span>
      </div>
      {checkFee && (
        <Modal
          header="Networks fees"
          body={
            <div
              className="flexCenter flex-col text-center"
              // onClick={() => setSuccessModal(false)}
            >
              <p
                style={{ fontSize: '20px' }}
                className="font-poppins dark:text-white text-nft-black-1 font-normal  minlg:text-xl mt-6"
              >
                {/* <Image src={images.error} objectFit="cover" layout="fill" /> */}
                From:
                <span className="font-semibold text-success-color">
                  {' '}
                  zkSync Era
                  <span className="text-white"> to </span>
                  <span className="font-semibold text-success-color">
                    {' '}
                    Arbitrum, Optimism, Base, Linea{' '}
                  </span>
                </span>
                = 0.0006 eth
              </p>
              <p className="font-poppins dark:text-white text-nft-black-1 font-normal text text-sm minlg:text-xl mt-10">
                {/* <Image src={images.error} objectFit="cover" layout="fill" /> */}
                From:
                <span className="font-semibold text-success-color">
                  {' '}
                  Arbitrum & Optimism & Base
                  <span className="text-white"> to </span>
                  <span className="font-semibold text-success-color">
                    {' '}
                    zkSync Era{' '}
                  </span>
                </span>
                0.002 eth
              </p>
              <p className="font-poppins dark:text-white text-nft-black-1 font-normal text text-sm minlg:text-xl mt-10">
                {/* <Image src={images.error} objectFit="cover" layout="fill" /> */}
                From:
                <span className="font-semibold text-success-color">
                  {' '}
                  Arbitrum & Optimism
                  <span className="text-white"> to </span>
                  <span className="font-semibold text-success-color">
                    {' '}
                    Base{' '}
                  </span>
                </span>
                0.0009 eth
              </p>
            </div>
          }
          handleClose={() => setCheckFee(false)}
        />
      )}
    </div>
  );
};

export default BridgeNFTs;
