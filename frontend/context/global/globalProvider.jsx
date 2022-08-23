import { providers } from 'ethers';
import { useEffect, useRef, useState } from 'react';
import { GlobalContext } from './globalContext';
import Web3Modal from 'web3modal';
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';
// import WalletConnect from '@walletconnect/web3-provider';

import { toast } from 'react-toastify';
import { config } from '../../config/config';
import { humanizeAddress } from '../../helpers';

export const GlobalProvider = ({ children }) => {
  const web3ModalRef = useRef();

  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState(null);
  const [address, setAddress] = useState(null);
  const [globalStateChanged, setGlobalStateChanged] = useState(false);
  const [balances, setBalances] = useState([]);

  useEffect(() => {
    let _address = localStorage.getItem('address');
    setAddress(_address);
    setUserName(humanizeAddress(_address || ''));
  }, []);

  const handleConnectWallet = async () => {
    try {
      web3ModalRef.current = new Web3Modal({
        network: 'mumbai',
        providerOptions: getProviderOptions(),
        // theme: {
        //   background: colors.background,
        //   main: colors.secondary,
        //   secondary: colors.primary,
        //   border: colors.background,
        //   hover: colors.tertiary,
        // },
        // theme: 'light',
      });
      await web3ModalRef.current.connect();

      const signer = await getProviderOrSigner(true);
      if (signer) {
        let _address = await signer.getAddress();
        setAddress(_address);
        setUserName(humanizeAddress(_address));
        subscribeProvider(signer);
        localStorage.setItem('address', _address);
      }
    } catch (err) {
      toast.error('Failed to connect wallet');
    }
  };
  const getProviderOptions = () => {
    const infuraId = config.REACT_APP_INFURA_ID;
    const providerOptions = {
      // walletconnect: {
      //   package: WalletConnect,
      //   options: {
      //     infuraId,
      //   },
      // },
      // torus: {
      //   package: Torus,
      // },
      coinbasewallet: {
        package: CoinbaseWalletSDK,
        options: {
          appName: config.REACT_APP_NAME,
          infuraId,
        },
      },
    };
    return providerOptions;
  };

  const subscribeProvider = async (provider) => {
    if (!provider.on) {
      return;
    }
    provider.on('close', () => disconnectWallet());
    provider.on('accountsChanged', async (accounts) => {
      setAddress(accounts[0]);
      localStorage.setItem('address', accounts[0]);
    });
    provider.on('chainChanged', async (chainId) => {
      if (!config.SUPPORTED_CHAIN_IDS.includes(chainId)) {
        toast.error('Change network to Mumbai testnet');
      }
    });

    provider.on('networkChanged', async (networkId) => {
      if (!config.SUPPORTED_CHAIN_IDS.includes(networkId)) {
        toast.error('Change network to Mumbai testnet');
      }
    });
  };

  const handleDisconnectWallet = async () => {
    // if (Web3Modal.currentProvider && web3ModalRef.currentProvider.close) {
    //   await web3.currentProvider.close();
    // }
    // await (web3ModalRef.current).clearCachedProvider();
    setUserName(null);
    setAddress(null);
    localStorage.removeItem('address');
  };

  const getProviderOrSigner = async (needSigner = false) => {
    const provider = new providers.Web3Provider(window.ethereum);

    const { chainId } = await provider.getNetwork();
    if (!config.SUPPORTED_CHAIN_IDS.includes(chainId)) {
      toast.error('Failed to connect. Please change network to Mumbai Testnet');
      return null;
    }

    if (needSigner) {
      await provider.send('eth_requestAccounts', []);
      const signer = provider.getSigner();
      if (signer) {
        return signer;
      }
      toast.error('You need to allow MetaMask.');
      return null;
    }

    return provider;
  };

  return (
    <GlobalContext.Provider
      value={{
        isLoading,
        setIsLoading,
        userName,
        setUserName,
        address,
        setAddress,
        getProviderOrSigner,
        handleConnectWallet,
        handleDisconnectWallet,
        globalStateChanged,
        setGlobalStateChanged,
        setBalances,
        balances,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
