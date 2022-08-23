import { createContext } from "react";

const defaultValue = {
  isLoading: true,
  userName: null,
  address: null,
  globalStateChanged: false,
  balances: [],

  setIsLoading: (value) => { },
  setUserName: (value) => { },
  setAddress: (value) => { },

  handleConnectWallet: async () => { },
  handleDisconnectWallet: async () => { },
  getProviderOrSigner: async (
    needSigner = false,
  ) => null,
  setGlobalStateChanged: (value) => { },
  setBalances: (value) => { }
};

export const GlobalContext = createContext(defaultValue);
