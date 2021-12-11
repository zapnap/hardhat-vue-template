import Web3Modal from "web3modal";
import BurnerConnectProvider from "@burner-wallet/burner-connect-provider";
import { ethers } from "ethers";
import addresses from "@/contracts/addresses.json";
import chains from "@/contracts/chains.json";

// import WalletConnectProvider from '@walletconnect/web3-provider'
// export const defaultProvider = new ethers.providers.InfuraProvider(null, process.env.VUE_APP_INFURA_ID);

const providerOptions = {
  /*
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: process.env.VUE_APP_INFURA_ID,
      rpc: {
        56: 'https://bsc-dataseed.binance.org/',
      },
    }
  },
  */
  burnerconnect: {
    package: BurnerConnectProvider,
    options: {
      defaultNetwork: "100",
    },
  },
};

export const web3Modal = new Web3Modal({
  network: "mainnet",
  cacheProvider: true,
  providerOptions,
});

export const ethersProvider = null;
export const web3Provider = null;

// initial state
const state = () => ({
  isInitialized: false,
  isConnected: false,
  activeAccount: null,
  activeBalance: 0,
  chainId: null,
  chainData: null,
  chainSupported: true,
  error: null,
  web3Provider: null,
});

// getters
const getters = {
  isInitialized(state) {
    return state.isInitialized;
  },
  isUserConnected(state) {
    return state.isConnected;
  },
  getActiveAccount(state) {
    return state.activeAccount;
  },
  getActiveBalanceWei(state) {
    return state.activeBalance;
  },
  getActiveBalanceEth(state) {
    return ethers.utils.formatEther(state.activeBalance);
  },
  getChainId(state) {
    return state.chainId;
  },
  getChainData(state) {
    return state.chainData;
  },
  getChainSupported(state) {
    return state.chainSupported;
  },
  getWeb3Provider(state) {
    return state.web3Provider;
  },
};

// actions
const actions = {
  async connect({ commit, dispatch, getters }) {
    const web3Provider = await web3Modal.connect();

    web3Provider.on("chainChanged", (chainId) => {
      commit("setChainData", chainId);
      actions.fetchActiveBalance({ commit, getters });
      window.location.reload();
    });

    web3Provider.on("accountsChanged", async (accounts) => {
      if (accounts.length === 0) {
        dispatch("disconnect");
      } else {
        const signer = ethersProvider.getSigner(accounts[0]);
        const network = await ethersProvider.getNetwork();
        commit("setActiveAccount", await signer.getAddress());
        commit("setChainData", network.chainId);
        commit("connected", true);
        actions.fetchActiveBalance({ commit, getters });
      }
    });

    web3Provider.on("connect", (/*connectInfo*/) => {
      // TODO
    });

    web3Provider.on("disconnect", async (error) => {
      console.error(error);
      dispatch("disconnect");
    });

    const ethersProvider = new ethers.providers.Web3Provider(web3Provider);
    const signer = ethersProvider.getSigner();
    const network = await ethersProvider.getNetwork();
    const address = await signer.getAddress();

    commit("setWeb3Provider", web3Provider);
    commit("setActiveAccount", address);
    commit("setChainData", network.chainId);
    commit("setIsConnected", true);
    commit("setIsInitialized", true);
    actions.fetchActiveBalance({ commit, getters });
  },

  disconnect({ commit }) {
    web3Modal.clearCachedProvider();
    // localStorage.removeItem("walletconnect");
    commit("setWeb3Provider", null);
    commit("setActiveAccount", "");
    commit("setChainData", null);
    commit("setIsConnected", false);
    commit("setActiveBalance", 0);
    commit("setError", "");

    window.location.href = "../";
  },

  init({ commit, dispatch }) {
    if (web3Modal.cachedProvider) {
      dispatch("connect");
    } else {
      commit("setIsInitialized", true);
    }
  },

  async fetchActiveBalance({ commit, getters }) {
    const ethersProvider = new ethers.providers.Web3Provider(
      getters.getWeb3Provider
    );
    const balance = await ethersProvider.getBalance(getters.getActiveAccount);
    commit("setActiveBalance", balance);
  },
};

// mutations
const mutations = {
  setWeb3Provider: function (state, value) {
    state.web3Provider = value;
  },
  setIsInitialized: function (state, value) {
    state.isInitialized = value;
  },
  setIsConnected: function (state, value) {
    state.isConnected = value;
  },
  setError: function (state, value) {
    state.error = value;
  },
  setActiveAccount: function (state, value) {
    state.activeAccount = value;
  },
  setActiveBalance: function (state, value) {
    state.activeBalance = value;
  },
  setChainData: function (state, value) {
    const production = process.env.NODE_ENV === "production";
    const testNetworkIds = [1337, 31337];
    const id = parseInt(value);

    const defaultData = {
      name: id === 1337 ? "Localhost" : "Unknown",
      chainId: id,
      networkId: id,
    };

    let chainData = defaultData;
    state.chainId = id;

    if (value !== null) {
      let chainSupported = addresses.Greeter[value] !== undefined;
      if (production) {
        if (testNetworkIds.includes(state.chainId)) {
          chainSupported = false;
        }
      }
      state.chainSupported = chainSupported;
      chainData = chains.filter((c: any) => c.chainId === value)[0];
    }
    state.chainData = chainData || defaultData;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
