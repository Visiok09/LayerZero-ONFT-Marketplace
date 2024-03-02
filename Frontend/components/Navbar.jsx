import React, { useState, useEffect, useContext, useRef } from 'react';

import { useRouter } from 'next/router';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';

import { NFTContext } from '../context/NFTContext';
import images from '../assets';
import Button from './Button';
import config from '../context/config.json';
import arr from '../assets/arrow.png';
import ChainId from './ChainId/ChainId';
import ModalPoints from './ModalPoints';
import { BsPower } from 'react-icons/bs';
import Points from './Points';
import {
  saveWalletInfoToLocalStorage,
  saveNetworkToLocalStorage,
  getWalletInfoFromLocalStorage,
  clearLocalStorage,
} from '../context/walletStorage';

const MenuItems = ({ isMobile, active, setActive }) => {
  const generateLink = (i) => {
    switch (i) {
      case 0:
        return '/';
      case 1:
        return '/listed-nfts';
      case 2:
        return '/my-nfts';
      case 3:
        return '/bridge-nfts';

      default:
        break;
    }
  };

  return (
    <ul
      className={`list-none flexCenter flex-row ${
        isMobile && 'flex-col h-full'
      }`}
    >
      {['Explore NFTs', 'Listed NFTs', 'My NFTs', 'Bridge'].map((item, i) => (
        <li
          key={i}
          onClick={() => {
            setActive(item);

            if (isMobile) {
              // eslint-disable-next-line no-undef
              // setIsOpen(false);
              console.log(`is mobile ${isMobile}`);
            }
          }}
          className={
            isMobile
              ? `flex flex-row items-center font-poppins font-semibold mx-3 text-4xl mb-8 ${
                  active === item
                    ? 'dark:text-white text-nft-black-1'
                    : 'dark:text-nft-gray-3 text-nft-gray-2 '
                }

          `
              : `flex flex-row items-center font-poppins font-semibold text-base dark:hover:text-white hover:text-nft-dark mx-3 ${
                  active === item
                    ? 'dark:text-white text-nft-black-1'
                    : 'dark:text-nft-gray-3 text-nft-gray-2 '
                }
          `
          }
        >
          <Link href={generateLink(i)}>{item}</Link>
        </li>
      ))}
    </ul>
  );
};

// eslint-disable-next-line no-shadow
const ButtonGroup = ({
  setActive,
  router,
  isMobile,
  setIsOpen,
  handleOpenModal,
}) => {
  const {
    checkNetwork,
    connectWallet,
    currentAccount,
    network,
    isMetaMaskInstalled,
    walletConnected,
    currentChainId,
    setCurrentAccount,
  } = useContext(NFTContext);

  return (
    <div className="button-group">
      {currentAccount && currentChainId ? (
        <Button
          btnName="Create"
          classStyles={
            isMobile ? 'mx-2 rounded-xl text-2xl' : 'mx-2 rounded-xl'
          }
          handleClick={() => {
            setActive('');
            if (isMobile) {
              setIsOpen(false);
            }
            router.push('/create-nft');
          }}
        />
      ) : (
        <Button
          btnName="Connect Wallet"
          classStyles={
            isMobile ? 'mx-2 rounded-xl text-2xl' : 'mx-2 rounded-xl'
          }
          handleClick={handleOpenModal}
        />
      )}
    </div>
  );
};

const checkActive = (active, setActive, router) => {
  switch (router.pathname) {
    case '/':
      if (active !== 'Explore NFTs') setActive('Explore NFTs');
      break;
    case '/listed-nfts':
      if (active !== 'Listed NFTs') setActive('Listed NFTs');
      break;
    case '/my-nfts':
      if (active !== 'My NFTs') setActive('My NFTs');
      break;
    case '/bridge-nfts':
      if (active !== 'Bridge') setActive('Bridge');
      break;
    case '/create-nft':
      setActive('');
      break;

    default:
      setActive('');
  }
};

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [active, setActive] = useState('Explore NFTs');
  // eslint-disable-next-line no-shadow
  const [isOpen, setIsOpen] = useState(false);
  const {
    currentChainId,
    connectWallet,
    currentAccount,
    walletConnected,
    setWalletConnected,
    setCurrentAccount,
    setNetwork,
    userPoint,
    setCurrentChain,
    selectedChainName,
    setSelectedChainName,
  } = useContext(NFTContext);
  const [networkNotify, setNetworkNotify] = useState(false);

  //const [selectedChainName, setSelectedChainName] = useState('Networks');
  const selectorRef = useRef(null);

  const [openModal, setOpenModal] = useState(false);
  const [pointsMenu, setPointsMenu] = useState(false);

  const handlePointsMenu = () => {
    setPointsMenu(!pointsMenu);
  };

  const handleOpenModal = () => {
    setOpenModal(!openModal);
  };

  const handleConnect = async () => {
    await connectWallet();
    setOpenModal(false);
  };

  const handleDisconect = () => {
    console.log('AAAa');
    setSelectedChainName('Networks');
    clearLocalStorage();
    setWalletConnected(false);
    setCurrentAccount('');
    setNetwork(false);
  };

  const onChangeChain = (chainName) => {
    setSelectedChainName(chainName);
    localStorage.setItem('selectedChainName', chainName);
  };

  const openNetwork = () => {
    setNetworkNotify(!networkNotify);
  };

  const hideNetwork = () => {
    setNetworkNotify(false);
  };

  const handleDocumentClick = (event) => {
    // Check if the click event occurred outside the selector component
    if (selectorRef.current && !selectorRef.current.contains(event.target)) {
      setNetworkNotify(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleDocumentClick);
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);

  useEffect(() => {
    setTheme('dark');
  }, []);

  useEffect(() => {
    checkActive(active, setActive, router);
  }, [router.pathname]);

  useEffect(() => {
    const storedChainName = localStorage.getItem('selectedChainName');
    if (storedChainName) {
      setSelectedChainName(storedChainName);
    }
  }, [currentChainId]);

  useEffect(() => {
    switch (currentChainId) {
      case 324:
        setSelectedChainName('zkSync Era');
        break;
      case 59144:
        setSelectedChainName('Linea');
        break;
      case 10:
        setSelectedChainName('Optimism');
        break;
      case 42161:
        setSelectedChainName('Arbitrum One');
        break;
      case 42170:
        setSelectedChainName('Arbitrum Nova');
        break;
      case 8453:
        setSelectedChainName('Base');
        break;
      case 167007:
        setSelectedChainName('Taiko Jolnir');
        break;
      case 5000:
        setSelectedChainName('Mantle');
        break;
      case 534351:
        setSelectedChainName('Scroll Sepolia');
        break;
      case 1101:
        setSelectedChainName('Polygon zkEVM');
        break;
      case 11155111:
        setSelectedChainName('Sepolia');
        break;
      case 168587773:
        setSelectedChainName('Blast Sepolia');
        break;
      // Add more cases as needed for other chain IDs
      default:
        // Handle the default case if none of the conditions match
        break;
    }
  }, [currentChainId]);

  return (
    <nav
      className="flexBetween w-full fixed z-10 p-4 flex-row border-b
dark:bg-nft-dark
bg-white
dark:border-nft-black-1
border-nft-gray-1"
    >
      <div className="flex flex-1 flex-row justify-start">
        <Link href="/">
          <div
            className="flexCenter md:hidden cursor-pointer"
            onClick={() => setActive('')}
          >
            <Image
              src={images.bb}
              objectFit="contain"
              width={35}
              height={35}
              alt="logo"
            />
            <p className="dark:text-white text-nft-black-1 font-semibold text-lg ml-1">
              BettaBridge.
            </p>
          </div>
        </Link>
        <Link href="/">
          <div className="hidden md:flex" onClick={() => setIsOpen(false)}>
            <Image
              src={images.log}
              objectFit="contain"
              width={32}
              height={32}
              alt="logo"
            />
          </div>
        </Link>
      </div>
      {/* <Points onClick={() => handlePointsMenu()} /> */}
      {pointsMenu && (
        <ModalPoints
          header="Alphafarm is Live!"
          body={
            <div className=" p-4 flex-col text-center h-full ">
              <p className="font-poppins dark:text-white text-nft-black-1 text-2xl ">
                <span className="font-semibold text-success-color">
                  <span className="text-white"> My points </span>{' '}
                  <span className="text-white">is</span>{' '}
                  <span style={{ color: 'gold' }}>{userPoint}</span>
                </span>
              </p>
              <p className="font-poppins dark:text-white text-nft-black-1 font-normal text text-sm minlg:text-xl mt-2">
                <span className="text-green-500">Ways to Earn ? </span> <br />
                <span className=" text-xl ">
                  1. Create NFT:{' '}
                  <span className="font-semibold">
                    <span className="text-amber-300">3 pts</span> for each NFT
                    you create on the platform.
                  </span>
                  <br />
                  2. List on Marketplace:{' '}
                  <span className="font-semibold ">
                    <span className="text-amber-300">3 pts</span> for each NFT
                    you list on the marketplace.
                  </span>{' '}
                  <br />
                  3. Buy on Marketplace:{' '}
                  <span className="font-semibold">
                    <span className="text-amber-300">5 pts</span> for each
                    successful NFT purchase.
                  </span>
                  <br />
                  4. Bridge NFT:{' '}
                  <span className="font-semibold ">
                    Stay tuned for details on earning pts for bridging NFTs.
                  </span>
                </span>
              </p>
            </div>
          }
          handleClose={() => setPointsMenu(false)}
        />
      )}
      <div className="flex flex-initial flex-row justify-end">
        <div className="flex items-center mr-2">
          <input
            type="checkbox"
            className="checkbox"
            id="checkbox"
            onChange={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          />
          <label
            htmlFor="checkbox"
            className="flexBetween w-8 h-4 dark:bg-white bg-black rounded-2xl p-1 relative label cursor-pointer"
          >
            <i className="fas fa-sun" style={{ color: 'white' }} />
            <i className="fas fa-moon" style={{ color: 'black' }} />
            <div className="w-3 h-3 absolute dark:bg-black bg-white rounded-full ball" />
          </label>
        </div>

        <div className="md:hidden flex">
          <MenuItems active={active} setActive={setActive} />
          <div className="ml-4">
            <ButtonGroup
              setActive={setActive}
              router={router}
              handleOpenModal={handleOpenModal}
            />
          </div>
        </div>
      </div>
      {openModal && (
        <ModalPoints
          header="Connect Wallet"
          body={
            <>
              <div className="connectModal" onClick={handleConnect}>
                <Image
                  src={images.metamask}
                  alt="meta"
                  width={35}
                  height={35}
                />{' '}
                <span style={{ fontSize: '30px', marginLeft: '20px' }}>
                  MetaMask
                </span>
              </div>
              <div
                className="connectModal"
                onClick={handleConnect}
                style={{ cursor: 'not-allowed' }}
              >
                <Image src={images.walet} alt="wallet" width={35} height={35} />{' '}
                <span style={{ fontSize: '30px', marginLeft: '20px' }}>
                  WalletConnect
                </span>
              </div>
            </>
          }
          handleClose={() => setOpenModal(false)}
        />
      )}
      <div className="hidden md:flex ml-2">
        {isOpen ? (
          <Image
            src={images.cross}
            objectFit="contain"
            width={20}
            height={20}
            alt="close"
            onClick={() => setIsOpen(false)}
            className={theme === 'light' ? 'filter invert' : ''}
          />
        ) : (
          <Image
            src={images.menu}
            objectFit="contain"
            width={25}
            height={25}
            alt="menu"
            onClick={() => setIsOpen(true)}
            className={theme === 'light' ? 'filter invert' : ''}
          />
        )}
        {isOpen && (
          <div className="fixed inset-0 top-65 dark:bg-nft-dark bg-white z-10 nav-h flex justify-between flex-col">
            <div className="flex-1 p-4 ">
              <MenuItems
                active={active}
                setActive={setActive}
                isMobile
                setIsOpen={setIsOpen}
              />
            </div>
            <div className="p-4 border-t dark:border-nft-black-1 border-nft-gray-1 flex justify-center">
              <ButtonGroup
                setActive={setActive}
                router={router}
                isMobile
                setIsOpen={setIsOpen}
              />
            </div>
          </div>
        )}
      </div>
      <div className="selector" ref={selectorRef}>
        <div id="selectField" onMouseEnter={() => openNetwork()}>
          {selectedChainName}
        </div>
      </div>
      {networkNotify && (
        <ChainId
          onMouseLeave={() => hideNetwork()}
          onChangeChain={onChangeChain}
        />
      )}
      {currentAccount && (
        <div onClick={handleDisconect} className="ml-1 cursor-pointer">
          <BsPower className="text-2xl hover:text-red-500" />
        </div>
      )}
    </nav>
  );
};

export default Navbar;
