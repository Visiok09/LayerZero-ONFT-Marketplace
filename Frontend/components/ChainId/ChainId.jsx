import React, { useState, useEffect, useContext } from 'react';
import img from '../../assets';
import Style from './ChainId.module.css';
import Image from 'next/image';
import { saveNetworkToLocalStorage } from '../../context/walletStorage';
import { NFTContext } from '../../context/NFTContext';

const ChainId = ({ onChangeChain, onMouseLeave }) => {
  const { setCurrentChain } = useContext(NFTContext);

  const networkHandler = async (e, chainName) => {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: e }],
    });
    onChangeChain(chainName);
    saveNetworkToLocalStorage(e, chainName);
    if (typeof e === 'number') {
      console.log('e', e);
      //setCurrentChain(e);
    } else {
      const decimalChainId = parseInt(e, 16);
      console.log('decimalChainId', decimalChainId);
      setCurrentChain(decimalChainId);
    }
  };

  return (
    <div onMouseLeave={onMouseLeave} className={Style.networkStyle}>
      <ul>
        {/* <li
          className={Style.linkBox}
          onClick={() => networkHandler('0xa9', 'Manta')}
        >
          <Image src={img.creator} alt="manta" width={35} height={35} />
          <b>Manta</b>
        </li> */}
        <li
          className={Style.linkBox}
          onClick={() => networkHandler('0xa4ba', 'Arbitrum Nova')}
        >
          <Image src={img.nova} alt="nova" width={35} height={35} />
          <b>Arbitrum Nova</b>
        </li>
        {/* <li
          className={Style.linkBox}
          onClick={() => networkHandler('0xa4b1', 'Arbitrum One')}
        >
          <Image src={img.arbione} alt="arbitrum" width={35} height={35} />
          <b>Arbitrum One</b>
        </li> */}
        <li
          className={Style.linkBox}
          onClick={() => networkHandler('0x44d', 'Polygon zkEVM')}
        >
          <Image src={img.poly} alt="zkevm" width={35} height={35} />
          <b>Polygon zkEVM</b>
        </li>
        <li
          className={Style.linkBox}
          onClick={() => networkHandler('0x144', 'zkSync Era')}
        >
          <Image src={img.zksera} alt="era" width={35} height={35} />
          <b>zkSync Era</b>
        </li>
        <li
          className={Style.linkBox}
          onClick={() => networkHandler('0xa', 'Optimism')}
        >
          <Image src={img.optimism} alt="optimism" width={35} height={35} />
          <b>Optimism</b>
        </li>
        <li
          className={Style.linkBox}
          onClick={() => networkHandler('0xe708', 'Linea')}
        >
          <Image src={img.linea} alt="linea" width={35} height={35} />
          <b>Linea</b>
        </li>
        <li
          className={Style.linkBox}
          onClick={() => networkHandler('0x2105', 'Base')}
        >
          <Image src={img.base} alt="base" width={35} height={35} />
          <b>Base</b>
        </li>
        <li
          className={Style.linkBox}
          onClick={() => networkHandler('0x82750', 'Scroll')}
        >
          <Image src={img.scroll} alt="scroll" width={35} height={35} />
          <b>Scroll</b>
        </li>
        <li
          className={Style.linkBox}
          onClick={() => networkHandler('0xaa36a7', 'Sepolia')}
        >
          <Image src={img.ethereum} alt="sepolia" width={35} height={35} />
          <b>Sepolia</b>
        </li>
        <li
          className={Style.linkBox}
          onClick={() => networkHandler('0xa0c71fd', 'Blast Sepolia')}
        >
          <Image src={img.blast} alt="blast" width={35} height={35} />
          <b>Blast Sepolia</b>
        </li>
      </ul>
    </div>
  );
};

export default ChainId;
