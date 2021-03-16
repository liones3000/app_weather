const setParams = config => {
  const params = config.params || {};
  config.params = Object.assign(params, {
    appid: process.env.VUE_APP_API_KEY,
    lang: "ru",
    units: "metric"
  });

  return config;
};

const clearData = response => {
  return response.data;
};

export default function(axios) {
  axios.interceptors.request.use(setParams);
  axios.interceptors.response.use(clearData);
}
