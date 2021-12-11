import { shallowMount, createLocalVue } from "@vue/test-utils";
import Home from "@/views/Home.vue";
import Vuex from "vuex";

const localVue = createLocalVue();
localVue.use(Vuex);

import VueRouter from "vue-router";
const router = new VueRouter();

describe("Home.vue", () => {
  let state;
  let actions;
  let store;
  let stubs;

  function buildStore(getters) {
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

  function buildGetters(connected = true) {
    return {
      isUserConnected: () => connected,
      getChainData: () => {
        return {
          name: "My Network",
          chainId: 1337,
        };
      },
    };
  }

  beforeEach(() => {
    store = buildStore(buildGetters());
    stubs = ["router-link", "router-view"];
  });

  it("displays welcome message", () => {
    const wrapper = shallowMount(Home, { store, localVue, router, stubs });
    const el = wrapper.find("h1");
    expect(el.text()).toMatch("Welcome");
  });

  it("displays connected status message if connected", () => {
    const wrapper = shallowMount(Home, { store, localVue, router, stubs });
    const el = wrapper.find(".status-connected");
    expect(el.exists()).toBeTruthy();
    expect(el.text()).toMatch("My Network");
  });

  it("does not display status message if not connected", () => {
    store = buildStore(buildGetters(false));
    const wrapper = shallowMount(Home, { store, localVue, router, stubs });
    const el = wrapper.find(".status-connected");
    expect(el.exists()).not.toBeTruthy();
  });
});
