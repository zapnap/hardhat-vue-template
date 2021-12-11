import { shallowMount, createLocalVue } from "@vue/test-utils";
import flushPromises from "flush-promises";
import { windowEthereum, mockToasted } from "./../TestHelper";

import SetValue from "@/views/SetValue.vue";
import Vuex from "vuex";

const localVue = createLocalVue();
localVue.use(Vuex);

import VueRouter from "vue-router";
const router = new VueRouter();

window.ethereum = windowEthereum();
jest.mock("ethers", () => {
  const original = jest.requireActual("ethers");
  return {
    ...original,
    ethers: {
      ...original.ethers,
      Contract: jest.fn().mockImplementation(() => {
        let greeting = "hello test";
        return {
          greet: () => {
            return greeting;
          },
          setGreeting: (value: string) => {
            greeting = value;
            return {
              hash: "0x1something",
              wait: () => {
                return new Promise((resolve) => {
                  resolve("rcpt");
                });
              },
            };
          },
        };
      }),
    },
  };
});

describe("SetValue.vue", () => {
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

  function buildGetters() {
    return {
      isInitialized: () => true,
      isUserConnected: () => true,
      getChainId: () => "1337",
      getWeb3Provider: () => window.ethereum,
    };
  }

  function buildActions() {
    return {
      connect: () => true,
    };
  }

  beforeEach(async () => {
    getters = buildGetters();
    actions = buildActions();
    store = buildStore(getters, actions);
  });

  it("displays current greeting", async () => {
    const opts = { store, localVue, router, mocks: mockToasted() };
    const wrapper = shallowMount(SetValue, opts);

    await flushPromises();
    const el = wrapper.find(".get-greeting");
    expect(el.text()).toMatch("hello test");
  });

  it("sets a new greeting", async () => {
    const opts = { store, localVue, router, mocks: mockToasted() };
    const wrapper = shallowMount(SetValue, opts);
    const setEl = wrapper.find(".set-greeting");

    await setEl.find("input").setValue("Updated greeting");
    await setEl.find("button[type=submit]").trigger("click");

    // await wrapper.vm.$nextTick();
    await flushPromises();
    const getEl = wrapper.find(".get-greeting");
    expect(getEl.text()).toMatch("Updated greeting");
  });
});
