export const saveWalletInfoToLocalStorage = (
  walletConnected,
  currentAccount
) => {
  localStorage.setItem('walletConnected', walletConnected);
  localStorage.setItem('currentAccount', currentAccount);
};

export const getWalletInfoFromLocalStorage = () => {
  const savedWalletConnected = localStorage.getItem('walletConnected');
  const savedCurrentAccount = localStorage.getItem('currentAccount');

  const initialWalletConnected = savedWalletConnected
    ? JSON.parse(savedWalletConnected)
    : false;
  const initialCurrentAccount = savedCurrentAccount || undefined;

  return {
    walletConnected: initialWalletConnected,
    currentAccount: initialCurrentAccount,
  };
};

export const saveNetworkToLocalStorage = (chainId, chainName) => {
  if (typeof chainId === 'number') {
    localStorage.setItem('chainId', chainId);
    localStorage.setItem('chainName', chainName);
  } else {
    const decimalChainId = parseInt(chainId, 16);
    localStorage.setItem('chainId', decimalChainId);
    localStorage.setItem('chainName', chainName);
  }
};

export const getNetworkFromLocalStorage = () => {
  const savedChainId = parseInt(localStorage.getItem('chainId'));
  const savedChainName = localStorage.getItem('chainName');

  return { chainId: savedChainId, chainName: savedChainName };
};

export const saveNetworkInfoToLocalStorage = (network) => {
  localStorage.setItem('network', JSON.stringify(network));
};

export const getNetworkInfoFromLocalStorage = () => {
  const savedNetwork = localStorage.getItem('network');
  const initialNetwork = savedNetwork ? JSON.parse(savedNetwork) : false;
  return initialNetwork;
};

export const clearLocalStorage = () => {
  localStorage.removeItem('chainId');
  localStorage.removeItem('chainName');
  localStorage.removeItem('walletConnected');
  localStorage.removeItem('currentAccount');
  localStorage.removeItem('selectedChainName');
};
