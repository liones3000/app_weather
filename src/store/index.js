import Vue from "vue";
import Vuex from "vuex";
import weatherStore from "./modules/weather";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    weatherStore
  }
});

store.dispatch("initCountryList");

export default store;
