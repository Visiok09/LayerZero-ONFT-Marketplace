import { useState, useEffect, useRef, useContext } from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';

import { NFTContext } from '../context/NFTContext';
import { Banner, CreatorCard, Loader, NFTCard, SearchBar } from '../components';
import images from '../assets';
// import { makeId } from '../utils/makeid';
import { getCreators } from '../utils/getTopCreators';
import { shortenAddress } from '../utils/shortenAddress';
import { route } from 'next/dist/server/router';
import { useRouter } from 'next/router';

const Home = () => {
  const {
    fetchNFTs,
    setProvider,
    marketContract,
    currentChainId,
    creatingNft,
    nftsPerPage,
    currentAccount,
  } = useContext(NFTContext);
  const [hideButtons, setHideButtons] = useState(false);
  const [nfts, setNfts] = useState([]);
  const [nftsCopy, setNftsCopy] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSelect, setActiveSelect] = useState('Recently added');
  const { theme } = useTheme();
  const parentRef = useRef(null);
  const scrollRef = useRef(null);
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [loadMore, setLoadMore] = useState(false);
  const [hasMoreItems, setHasMoreItems] = useState(true);

  const loadMoreNFTs = async () => {
    setLoadMore(true);
    const newPage = currentPage + 1;

    const newNfts = await fetchNFTs(newPage); // Fetch the next page of NFTs
    if (newNfts.length < nftsPerPage) {
      setHasMoreItems(false);
    }
    if (newNfts.length > 0) {
      setNfts((prevNfts) => [...prevNfts, ...newNfts]); // Append newNfts to the existing ones
      setCurrentPage(newPage);
      setNftsCopy((prevNfts) => [...prevNfts, ...newNfts]);
    } else {
      setHasMoreItems(false);
      // Handle the case where there are no more NFTs to load (e.g., hide the "Load More" button)
    }
    setLoadMore(false);
  };

  // const loadMoreNFTs = async () => {
  //   setLoadMore(true);
  //   const newPage = currentPage + 1;

  //   const newNfts = await fetchNFTs(currentChainId, newPage);
  //   if (newNfts.length > 0) {
  //     setNfts((prevNfts) => [...prevNfts, ...newNfts,]); // Prepend newNfts
  //     setCurrentPage(newPage);
  //     setNftsCopy( (prevNfts) => [...prevNfts, ...newNfts,]);
  //   }
  //   setLoadMore(false);
  // };
  // useEffect(async () => {
  //   if(currentChainId){
  //     const initialNfts = await fetchNFTs(currentPage);
  //     setNfts(initialNfts);
  //     setNftsCopy(initialNfts);
  //     setIsLoading(false);
  //   }

  //     }, [currentChainId]);

  // useEffect(async () => {
  //   if (currentChainId) {
  //     try {
  //       const initialNfts = await fetchNFTs(currentPage);
  //
  //       setNfts(initialNfts);
  //       setNftsCopy(initialNfts);
  //       setIsLoading(false);
  //     } catch (error) {
  //       console.error('Error fetching NFTs:', error);
  //       // Handle the error, e.g., show an error message to the user
  //     }
  //   }
  // }, [currentChainId]);

  // useEffect(async () => {
  //   if (currentChainId) {
  //     const initialNfts = await fetchNFTs(currentChainId, currentPage);
  //     setNfts(initialNfts);
  //     setNftsCopy( initialNfts);
  //     setIsLoading(false);

  //   }
  // }, [currentChainId]);

  //set provider

  useEffect(() => {
    let isMounted = true;
    console.log('CurrentChain:', currentChainId);
    if (currentAccount && currentChainId) {
      const fetchNfts = async () => {
        try {
          if (currentChainId) {
            const initialNfts = await fetchNFTs(currentPage);
            if (isMounted) {
              setNfts(initialNfts);
              setNftsCopy(initialNfts);
              setIsLoading(false);
            }
          }
        } catch (error) {
          console.log(error);
        }
      };

      fetchNfts();

      return () => {
        isMounted = false; // Cancel ongoing fetch operations
      };
    } else {
      //console.log('ABCCC');
    }
  }, [currentChainId, currentAccount]);

  // useEffect(() => {
  //   async function fetchData(){
  //     if(currentChainId){
  //       const initialNfts = await fetchNFTs(currentPage);
  //       setNfts(initialNfts);
  //       setNftsCopy(initialNfts);
  //       setIsLoading(false);
  //     }
  //   }
  //   fetchData();
  // }, [currentChainId]);

  useEffect(() => {
    const sortedNfts = [...nfts];

    switch (activeSelect) {
      case 'Price (low to high)':
        setNfts(sortedNfts.sort((a, b) => a.price - b.price));
        break;
      case 'Price (high to low)':
        setNfts(sortedNfts.sort((a, b) => b.price - a.price));
        break;
      case 'Recently added':
        setNfts(sortedNfts.sort((a, b) => b.tokenId - a.tokenId));
        break;
      default:
        setNfts(nfts);
        break;
    }
  }, [activeSelect]);

  const handleScroll = (direction) => {
    const { current } = scrollRef;

    const scrollAmount = window.innerWidth > 1800 ? 270 : 210;

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

  const topCreators = getCreators(nftsCopy);

  const onHandleSearch = (value) => {
    const filteredNfts = nfts.filter(({ name }) =>
      name.toLowerCase().includes(value.toLowerCase())
    );

    if (filteredNfts.length) {
      setNfts(filteredNfts);
    } else {
      setNfts(nftsCopy);
    }
  };

  const onClearSearch = () => {
    if (nfts.length && nftsCopy.length) {
      setNfts(nftsCopy);
    }
  };

  return (
    <div className="sm:px-4 p-12 w-full flexCenter flex-col">
      <div className="w-full minmd:w-7/5">
        <Banner
          name={
            <>
              <b>Cross-network NFT marketplace</b>
              {/* Discover, collect, sell and <b>bridge</b>
              <br /> NFTs */}
            </>
          }
          childStyles="md:text-4xl sm:text-2xl xs=text-xl text-left"
          parentStyles="justify-start mb-6 h-72 sm:h-60 p-12 xs:p-4 xs:h-44 rounded-3xl"
        />

        {!isLoading && !nfts.length ? (
          <h1 className="font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl font-semibold ml-4 xs:ml-0">
            That&apos;s weird... No NFTs for sale!
          </h1>
        ) : isLoading ? (
          <Loader />
        ) : (
          <>
            <div>
              <h1 className="font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl font-semibold ml-4 xs:ml-0">
                Top Sellers
              </h1>

              <div
                className="relative flex-1 max-w-full flex mt-3"
                ref={parentRef}
              >
                <div
                  className="flex flex-row w-max overflow-x-scroll no-scrollbar select-none"
                  ref={scrollRef}
                >
                  {/* {topCreators.map((creator, i) => (
                    <CreatorCard
                      key={creator.seller}
                      rank={i + 1}
                      creatorImage={images[`creator${i + 1}`]}
                      creatorName={shortenAddress(creator.seller)}
                      creatorEths={creator.sum}
                      currentAddress={creator.seller}
                    />
                  ))} */}
                  {topCreators.slice(0, 12).map((creator, i) => (
                    <CreatorCard
                      key={creator.seller}
                      rank={i + 1}
                      creatorImage={images[`creator${i + 1}`]}
                      creatorName={shortenAddress(creator.seller)}
                      creatorEths={creator.sum}
                      currentAddress={creator.seller}
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

            <div className="mt-10">
              <div className="flexBetween mx-4 xs:mx-0 minlg:mx-8 sm:flex-col sm:items-start">
                <h1 className="flex-1 before:first:font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl font-semibold sm:mb-4">
                  Hot NFTs
                </h1>
                <div className="flex-2 flex sm:w-full flex-row sm:flex-col">
                  <SearchBar
                    activeSelect={activeSelect}
                    setActiveSelect={setActiveSelect}
                    handleSearch={onHandleSearch}
                    clearSearch={onClearSearch}
                  />
                </div>
              </div>
              <div className="mt-3 w-full flex flex-wrap justify-start md:justify-center">
                {/* {nfts.map((nft, index) => (
                  <NFTCard key={`nft-${nft.tokenId}-${index}`} nft={nft} />
                ))} */}
                {nfts.map((nft) => (
                  <NFTCard key={`nft-${nft.tokenId}`} nft={nft} />
                ))}
                {loadMore && <Loader />}
              </div>
              {hasMoreItems && (
                <button className="buutonLoader" onClick={loadMoreNFTs}>
                  Load More
                </button>
              )}
              {/* <button className="buutonLoader" onClick={loadMoreNFTs}>Load More</button> */}
            </div>
          </>
        )}
        {/* <div ref={loadMoreRef} style={{height: 20, background: 'red'}}/> */}
      </div>
    </div>
  );
};

export default Home;
