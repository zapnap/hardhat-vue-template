import { shallowMount, createLocalVue } from "@vue/test-utils";
import { windowEthereum } from "./../TestHelper";

import Navbar from "@/components/Navbar.vue";
import Vuex from "vuex";

const localVue = createLocalVue();
localVue.use(Vuex);

import VueRouter from "vue-router";
const router = new VueRouter();

window.ethereum = windowEthereum();

describe("Navbar.vue", () => {
  let state;
  let store;
  let getters;
  let actions;

  function buildStore(getters, actions) {
    return new Vuex.Store({
      modules: {
        accounts: {
          state,
          actions,
          getters,
          namespaced: true,
        },
      },
    });
  }

  function buildGetters({ connected = true }) {
    return {
      getChainId: () => "1337",
      getWeb3Provider: () => window.ethereum,
      isUserConnected: () => connected,
      getActiveAccount: () => "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      getChainData: () => {
        return {
          name: "Testnet",
        };
      },
    };
  }

  function buildActions() {
    return {
      connect: () => true,
      init: () => true,
    };
  }

  describe("connected", () => {
    beforeEach(async () => {
      getters = buildGetters({ connected: true });
      actions = buildActions();
      store = buildStore(getters, actions);
    });

    it("displays wallet address and network name", async () => {
      const opts = { store, localVue, router, stubs: ["router-link"] };
      const wrapper = shallowMount(Navbar, opts);

      expect(wrapper.find(".user-account").text()).toMatch("0xf39Fd6e...2266");
      expect(wrapper.find(".network-name").text()).toMatch("Testnet");
      expect(wrapper.find(".connect-wallet").exists()).not.toBeTruthy();
    });
  });

  describe("not connected", () => {
    beforeEach(async () => {
      getters = buildGetters({ connected: false });
      actions = buildActions();
      store = buildStore(getters, actions);
    });

    it("displays connect prompt", async () => {
      const opts = { store, localVue, router, stubs: ["router-link"] };
      const wrapper = shallowMount(Navbar, opts);

      expect(wrapper.find(".connect-wallet").text()).toMatch("Connect");
      expect(wrapper.find(".user-account").exists()).not.toBeTruthy();
      expect(wrapper.find(".network-name").exists()).not.toBeTruthy();
    });
  });
});
