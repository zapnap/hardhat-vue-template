import Vue from "vue";
import Vuex from "vuex";

import accounts from "./modules/accounts";

Vue.use(Vuex);

export default new Vuex.Store({
  // state: {},
  // mutations: {},
  // actions: {},
  modules: {
    accounts,
  },
});
