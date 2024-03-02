import React, { useState, useEffect, useContext } from 'react';
import img from '../../assets';
import Style from './ChainId.module.css';
import Image from 'next/image';
import { NFTContext } from '../../context/NFTContext';
const BridgeChains = ({ onChangeBrigeChain, onMouseLeave, onClick }) => {
  const networkHandler = (chainName, e) => {
    onChangeBrigeChain(chainName, e);
  };
  const { currentChainId } = useContext(NFTContext);
  // console.log(`chainId from BridgeChains${currentChainId}`);
  const chains = [
    // {
    //   mainChain: '420',
    //   id: '10132',
    //   name: 'Optimism Goerli',
    //   img: img.optimism,
    // },
    // {
    //   mainChain: '421613',
    //   id: '10143',
    //   name: 'Arbitrum Goerli',
    //   img: img.arbione,
    // },
    // {
    //   mainChain: '5',
    //   id: '10121',
    //   name: 'Ethereum Goerli',
    //   img: img.ethereum,
    // },
    // {
    //   mainChain: '84531',
    //   id: '10160',
    //   name: 'Base Goerli',
    //   img: img.base,
    // },
    // const ARB = 110
    // const OP = 111
    // const NOVA = 175
    // const LINEA = 183
    // const BASE = 184
    // const SCROLL = 214
    // const POL = 109
    // const ZK = 165

    {
      mainChain: '42170',
      id: '175',
      name: 'Nova',
      img: img.nova,
    },
    {
      mainChain: '534352',
      id: '214',
      name: 'Scroll',
      img: img.scroll,
    },
    {
      mainChain: '8453',
      id: '184',
      name: 'Base',
      img: img.base,
    },
    {
      mainChain: '59144',
      id: '183',
      name: 'Linea',
      img: img.linea,
    },
    {
      mainChain: '324',
      id: '165',
      name: 'zkSync',
      img: img.zksera,
    },
    {
      mainChain: '10',
      id: '111',
      name: 'Optimism',
      img: img.optimism,
    },
    {
      mainChain: '1101',
      id: '158',
      name: 'zkEVM',
      img: img.poly,
    },
    {
      mainChain: '169',
      id: '217',
      name: 'Manta',
      img: img.creator1,
    },
    {
      mainChain: '168587773',
      id: '10243',
      name: 'Blast Sepolia',
      img: img.blast,
    },
    {
      mainChain: '11155111',
      id: '10161',
      name: 'Sepolia',
      img: img.ethereum,
    },
  ];

  return (
    <div
      onMouseLeave={onMouseLeave}
      className={Style.BridgeNetworkStyle}
      onClick={onClick}
    >
      <ul>
        {chains
          .filter((chain) => chain.mainChain !== currentChainId)
          .map((chain, index) => {
            // Define an array of the indexes you want to display

            // Check if the currentChainId is 'someId' and only return chains at certain indexes
            if (currentChainId === 59144) {
              const desiredIndexes = [1, 2, 5, 6];
              // Check if the current index is one of the desired indexes
              if (desiredIndexes.includes(index)) {
                return (
                  <li
                    key={chain.id}
                    className={Style.linkBox}
                    onClick={() => networkHandler(chain.name, chain.id)}
                  >
                    <Image
                      src={chain.img}
                      alt={chain.name}
                      width={35}
                      height={35}
                    />
                    <b>{chain.name}</b>
                  </li>
                );
              } else {
                // If the index is not one of the desired ones, do not render anything for this iteration
                return null;
              }
            } else if (currentChainId === 8453) {
              const desiredIndexes = [0, 1, 5, 6];
              // Check if the current index is one of the desired indexes
              if (desiredIndexes.includes(index)) {
                return (
                  <li
                    key={chain.id}
                    className={Style.linkBox}
                    onClick={() => networkHandler(chain.name, chain.id)}
                  >
                    <Image
                      src={chain.img}
                      alt={chain.name}
                      width={35}
                      height={35}
                    />
                    <b>{chain.name}</b>
                  </li>
                );
              } else {
                // If the index is not one of the desired ones, do not render anything for this iteration
                return null;
              }
            } else if (currentChainId === 42170) {
              const desiredIndexes = [2, 5];
              // Check if the current index is one of the desired indexes
              if (desiredIndexes.includes(index)) {
                return (
                  <li
                    key={chain.id}
                    className={Style.linkBox}
                    onClick={() => networkHandler(chain.name, chain.id)}
                  >
                    <Image
                      src={chain.img}
                      alt={chain.name}
                      width={35}
                      height={35}
                    />
                    <b>{chain.name}</b>
                  </li>
                );
              } else {
                // If the index is not one of the desired ones, do not render anything for this iteration
                return null;
              }
            } else if (currentChainId === 534352) {
              const desiredIndexes = [2, 5, 6];
              // Check if the current index is one of the desired indexes
              if (desiredIndexes.includes(index)) {
                return (
                  <li
                    key={chain.id}
                    className={Style.linkBox}
                    onClick={() => networkHandler(chain.name, chain.id)}
                  >
                    <Image
                      src={chain.img}
                      alt={chain.name}
                      width={35}
                      height={35}
                    />
                    <b>{chain.name}</b>
                  </li>
                );
              } else {
                // If the index is not one of the desired ones, do not render anything for this iteration
                return null;
              }
            } else if (currentChainId === 324) {
              const desiredIndexes = [0, 1, 2, 5, 6];
              // Check if the current index is one of the desired indexes
              if (desiredIndexes.includes(index)) {
                return (
                  <li
                    key={chain.id}
                    className={Style.linkBox}
                    onClick={() => networkHandler(chain.name, chain.id)}
                  >
                    <Image
                      src={chain.img}
                      alt={chain.name}
                      width={35}
                      height={35}
                    />
                    <b>{chain.name}</b>
                  </li>
                );
              } else {
                // If the index is not one of the desired ones, do not render anything for this iteration
                return null;
              }
            } else if (currentChainId === 10) {
              const desiredIndexes = [0, 1, 2, 6];
              // Check if the current index is one of the desired indexes
              if (desiredIndexes.includes(index)) {
                return (
                  <li
                    key={chain.id}
                    className={Style.linkBox}
                    onClick={() => networkHandler(chain.name, chain.id)}
                  >
                    <Image
                      src={chain.img}
                      alt={chain.name}
                      width={35}
                      height={35}
                    />
                    <b>{chain.name}</b>
                  </li>
                );
              } else {
                // If the index is not one of the desired ones, do not render anything for this iteration
                return null;
              }
            } else if (currentChainId === 1101) {
              const desiredIndexes = [2, 1, 3, 5];
              // Check if the current index is one of the desired indexes
              if (desiredIndexes.includes(index)) {
                return (
                  <li
                    key={chain.id}
                    className={Style.linkBox}
                    onClick={() => networkHandler(chain.name, chain.id)}
                  >
                    <Image
                      src={chain.img}
                      alt={chain.name}
                      width={35}
                      height={35}
                    />
                    <b>{chain.name}</b>
                  </li>
                );
              } else {
                // If the index is not one of the desired ones, do not render anything for this iteration
                return null;
              }
            } else if (currentChainId === 168587773) {
              const desiredIndexes = [9];
              // Check if the current index is one of the desired indexes
              if (desiredIndexes.includes(index)) {
                return (
                  <li
                    key={chain.id}
                    className={Style.linkBox}
                    onClick={() => networkHandler(chain.name, chain.id)}
                  >
                    <Image
                      src={chain.img}
                      alt={chain.name}
                      width={35}
                      height={35}
                    />
                    <b>{chain.name}</b>
                  </li>
                );
              } else {
                // If the index is not one of the desired ones, do not render anything for this iteration
                return null;
              }
            } else if (currentChainId === 11155111) {
              const desiredIndexes = [8];
              // Check if the current index is one of the desired indexes
              if (desiredIndexes.includes(index)) {
                return (
                  <li
                    key={chain.id}
                    className={Style.linkBox}
                    onClick={() => networkHandler(chain.name, chain.id)}
                  >
                    <Image
                      src={chain.img}
                      alt={chain.name}
                      width={35}
                      height={35}
                    />
                    <b>{chain.name}</b>
                  </li>
                );
              } else {
                // If the index is not one of the desired ones, do not render anything for this iteration
                return null;
              }
            } else {
              // If currentChainId is not 'someId', render all items as normal
              return (
                <li
                  key={chain.id}
                  className={Style.linkBox}
                  onClick={() => networkHandler(chain.name, chain.id)}
                >
                  <Image
                    src={chain.img}
                    alt={chain.name}
                    width={35}
                    height={35}
                  />
                  <b>{chain.name}</b>
                </li>
              );
            }
          })}
      </ul>
    </div>
  );
};

export default BridgeChains;
