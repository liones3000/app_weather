import Vue from "vue";
import axios from "@/plugins/axios";
import mutations from "../mutations";
import * as data from "../mock/city.list.min";

const dataList = data.default;

/**
 *
 * @param {Array} dataArray // массив данных
 */
const serializeDataList = (dataArray = []) => {
  //переменные
  const country = new Set();
  const data = {};

  //Получаем список стран.
  dataArray.forEach(el => country.add(el.country));

  country.forEach(el => {
    if (el.length < 2) return; //убираем пустой результат
    let countryKey = el;

    // Массив объектов по ключу "country". Например, ключ "ua" = [украинских городов].
    const filterCountryArray = dataArray.filter(
      item => item.country == countryKey
    );

    const cityObj = filterCountryArray.reduce((acc, item) => {
      acc[item.id] = item;
      return acc;
    }, {});

    // Добавляем в наш объект по ключу "country" мап с списком городов.
    Object.assign(data, {
      [countryKey]: cityObj
    });
  });
  return data;
};

const setCookies = (name, state) => {
  Vue.$cookies.set(name, state);
};

const deleteCookies = (name, id) => {
  const regexp = new RegExp(`${id}`);
  let strCookies = Vue.$cookies.get(name);
  if (!strCookies) return;
  const newCookie = strCookies
    .replace(regexp, "")
    .replace(/^,/, "")
    .replace(/,,/, ",")
    .replace(/,$/, "");
  console.log(newCookie);
  Vue.$cookies.set(name, newCookie);
};

const { SETCOUNTRYLIST, SETCITYWEATHER, DELETECITYFROMCITIES } = mutations;

const weatherStore = {
  namespaced: true,
  state: {
    countryList: null,
    cities: {},
    iconUrl:
      "//openweathermap.org/themes/openweathermap/assets/vendor/owm/img/widgets/"
  },
  getters: {
    getCountryList: ({ countryList }) => countryList,
    getCities: ({ cities }) => cities,
    getIconUrl: ({ iconUrl }) => iconUrl
  },
  mutations: {
    [SETCOUNTRYLIST](state, value) {
      state.countryList = value;
    },
    [SETCITYWEATHER](state, value) {
      const { id, value: cityObj } = value;
      Vue.set(state.cities, id, cityObj);
    },
    [DELETECITYFROMCITIES](state, cityId) {
      Vue.delete(state.cities, cityId);
    }
  },
  actions: {
    initCountryList: {
      handler({ dispatch }) {
        dispatch("setDataList");
      },
      root: true
    },
    setDataList({ commit }) {
      const countryList = serializeDataList(dataList);
      if (countryList) commit(SETCOUNTRYLIST, countryList);
    },

    /**
     *
     * @param {Object} param0 // context
     * @param {Number} idCity // Number id city
     */
    async fetchWeather({ commit, getters }, idCity) {
      const { getCities } = getters;
      try {
        const response = await axios.get(`weather?id=${idCity}`);
        commit(SETCITYWEATHER, {
          id: response.id,
          value: { ...response }
        });
        const cityId = Object.keys(getCities);
        setCookies("city", cityId);
        return response;
      } catch (err) {
        console.log("fetchWeather:", err.response?.data.message || err);
      }
    },
    deleteCity({ commit }, id) {
      deleteCookies("city", id);
      commit(DELETECITYFROMCITIES, id);
    }
  }
};

export default weatherStore;
