import { shallowMount, createLocalVue } from "@vue/test-utils";
import Profile from "@/views/Profile.vue";
import Vuex from "vuex";

const localVue = createLocalVue();
localVue.use(Vuex);

describe("Profile.vue", () => {
  let state;
  let getters;
  let actions;
  let store;

  beforeEach(() => {
    getters = {
      isInitialized: () => true,
      isUserConnected: () => true,
      getActiveAccount: () => "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
      getActiveBalanceEth: () => "10",
    };
    store = new Vuex.Store({
      modules: {
        accounts: {
          state,
          actions,
          getters: getters,
          namespaced: true,
        },
      },
    });
  });

  it("displays account address", () => {
    const wrapper = shallowMount(Profile, { store, localVue });
    const el = wrapper.find(".profile-address");
    expect(el.text()).toMatch("0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266");
  });

  it("displays account balance", () => {
    const wrapper = shallowMount(Profile, { store, localVue });
    const el = wrapper.find(".profile-balance");
    expect(el.text()).toMatch("10.0000 ETH");
  });
});
