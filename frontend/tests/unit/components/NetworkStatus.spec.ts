import { shallowMount, createLocalVue } from "@vue/test-utils";
import { windowEthereum } from "./../TestHelper";

import NetworkStatus from "@/components/NetworkStatus.vue";

import Vuex from "vuex";

const localVue = createLocalVue();
localVue.use(Vuex);

import VueRouter from "vue-router";
const router = new VueRouter();

window.ethereum = windowEthereum();

describe("NetworkStatus.vue", () => {
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

  function buildGetters({ supported = false }) {
    return {
      getChainId: () => "4",
      getWeb3Provider: () => window.ethereum,
      isUserConnected: () => true,
      getChainSupported: () => supported,
      getChainData: () => {
        return {
          name: "Rinkeby",
        };
      },
    };
  }

  function buildActions() {
    return {
      init: () => true,
    };
  }

  describe("network supported", () => {
    beforeEach(async () => {
      getters = buildGetters({ supported: true });
      actions = buildActions();
      store = buildStore(getters, actions);
    });

    it("does not display a warning", async () => {
      const opts = { store, localVue, router };
      const wrapper = shallowMount(NetworkStatus, opts);

      expect(
        wrapper.find(".network-status-alert.modal").isVisible()
      ).not.toBeTruthy();
    });
  });

  describe("network not supported", () => {
    beforeEach(async () => {
      getters = buildGetters({ supported: false });
      actions = buildActions();
      store = buildStore(getters, actions);
    });

    it("displays a warning and suggestions", async () => {
      const opts = { store, localVue, router };
      const wrapper = shallowMount(NetworkStatus, opts);

      expect(
        wrapper.find(".network-status-alert.modal").isVisible()
      ).toBeTruthy();
      expect(wrapper.find(".network-status-alert.modal").text()).toMatch(
        "Warning"
      );
      expect(wrapper.find(".warning-network").text()).toMatch("Rinkeby");
      expect(wrapper.find(".supported-networks").text()).toMatch("Localhost");
    });
  });
});
