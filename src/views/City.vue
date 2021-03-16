<template>
  <div class="city">
    <ElLink @click="backtoPage" class="city__btn"> Back </ElLink>
    <div class="city__header">
      <div class="city__icon">
        <img
          class="city__img"
          :src="fetchIcon"
          :alt="checkCity.weather[0].main"
        />
      </div>
      <div class="city__text">
        <h2 class="city__title">
          Город, страна: {{ checkCity.name }},
          {{ checkCity.sys.country }}
        </h2>
        <p class="city__descr">
          Погодные условия: {{ checkCity.weather[0].description }}
        </p>
      </div>
    </div>
    <div class="city__info">
      <table class="city__table table">
        <tbody>
          <tr class="table__row">
            <th colspan="2" class="table__header">Подробнее</th>
          </tr>
          <tr class="table__row">
            <td class="table__key">
              Ощущается как
            </td>
            <td class="table__value">{{ checkCity.main.feels_like }}&#176;C</td>
          </tr>
          <tr class="table__row">
            <td class="table__key">
              Ветер
            </td>
            <td class="table__value">
              {{ checkCity.wind.speed }} м/с, {{ checkCity.wind.deg }} &#176;
            </td>
          </tr>
          <tr class="weather-right-card__items">
            <td class="table__key">
              Влажность
            </td>
            <td class="table__value">{{ checkCity.main.humidity }}%</td>
          </tr>
          <template v-if="!!checkCity.rain">
            <tr class="weather-right-card__items">
              <td class="table__key">
                Дождь
              </td>
              <td class="table__value">{{ checkCity.rain["1h"] }} мм</td>
            </tr>
          </template>
          <tr class="weather-right-card__items">
            <td class="table__key">
              Давление
            </td>
            <td class="table__value">{{ checkCity.main.pressure }} hPa</td>
          </tr>
          <tr class="weather-right-card__items">
            <td class="table__key">
              Видимость
            </td>
            <td class="table__value">{{ checkCity.visibility }} м.</td>
          </tr>
          <tr class="weather-right-card__items">
            <td class="table__key">
              Облачность
            </td>
            <td class="table__value">{{ checkCity.clouds.all }} %</td>
          </tr>
          <tr class="weather-right-card__items">
            <td class="table__key">
              Дата обновления
            </td>
            <td class="table__value">{{ updateData }}</td>
          </tr>
          <tr class="weather-right-card__items">
            <td class="table__key">
              Восход
            </td>
            <td class="table__value">
              {{ sunTime(checkCity.sys.sunrise) }}
            </td>
          </tr>
          <tr class="weather-right-card__items">
            <td class="table__key">
              Закат
            </td>
            <td class="table__value">
              {{ sunTime(checkCity.sys.sunset) }}
            </td>
          </tr>
        </tbody>
      </table>
      <div class="city__charts">
        <ElButton type="warning" size="medium" round @click="fetchHour">
          Hourly forecast
        </ElButton>
        <template>
          <Charts :chart-data="chartData" :options="options" />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "@/plugins/axios";
import { mapGetters, mapActions } from "vuex";
import Charts from "@/components/charts";

const serializeHourlytemp = (array = []) => {
  return array.reduce((acc, next) => {
    acc[next.dt] = next.temp;
    return acc;
  }, {});
};

export default {
  name: "City",
  props: ["id"],
  components: {
    Charts
  },
  mounted() {
    this.checkCity;
  },
  data: () => ({
    chartData: {
      labels: [],
      datasets: [
        {
          label: "Hourse",
          backgroundColor: "#f87979"
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  }),
  methods: {
    ...mapActions("weatherStore", ["fetchWeather"]),
    backtoPage() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
    },
    sunTime(ms) {
      const date = new Date(ms * 1000);
      let hours = date
        .getHours()
        .toString()
        .replace(/\b(\d{1})\b/g, "0$1");
      let minutes = date
        .getMinutes()
        .toString()
        .replace(/\b(\d{1})\b/g, "0$1");
      let sec = date
        .getSeconds()
        .toString()
        .replace(/\b(\d{1})\b/g, "0$1");
      return `${hours}:${minutes}:${sec}`;
    },
    async fetchHour() {
      const lat = this.checkCity.coord.lat;
      const lon = this.checkCity.coord.lon;
      try {
        const response = await axios.get(`onecall`, {
          params: {
            lat,
            lon,
            exclude: "current,minutely,alerts"
          }
        });
        const result = await serializeHourlytemp(response.hourly);

        const dataLabels = Object.keys(result).reduce((acc, el) => {
          const newDate = new Date(Number(el) * 1000);
          const hours = newDate.getHours().toString();
          acc.push(hours);
          return acc;
        }, []);

        const dataSets = Object.values(result).reduce((acc, el) => {
          acc.push(el);
          return acc;
        }, []);
        console.log(dataSets);

        this.chartData.labels = dataLabels;

        console.log(this.chartData);

        this.chartData.datasets[0].data = dataSets;
      } catch (err) {
        console.log("fetchHour:", err);
        Promise.reject(err);
      }
    }
  },
  computed: {
    ...mapGetters("weatherStore", ["getCities", "getIconUrl"]),
    checkCity() {
      let data;
      if (this.getCities[this.id]) {
        data = this.getCities[this.id];
        console.log(data);
      } else {
        this.fetchWeather(this.id);
        data = this.getCities[this.id];
      }
      return data;
    },
    fetchIcon() {
      return `${this.getIconUrl}${this.checkCity.weather[0].icon}.png`;
    },
    updateData() {
      const date = new Date(this.checkCity.dt * 1000);
      let day = date
        .getDate()
        .toString()
        .replace(/\b(\d{1})\b/g, "0$1");
      let month = (date.getMonth() + 1)
        .toString()
        .replace(/\b(\d{1})\b/g, "0$1");
      let year = date
        .getFullYear()
        .toString()
        .slice(-2);
      let hours = date
        .getHours()
        .toString()
        .replace(/\b(\d{1})\b/g, "0$1");
      let minutes = date
        .getMinutes()
        .toString()
        .replace(/\b(\d{1})\b/g, "0$1");

      return `${day}.${month}.${year}, ${hours}:${minutes}`;
    }
  }
};
</script>

<style lang="scss" scoped>
.city {
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-around;
    max-width: 40%;
    margin: 0 auto;
    padding: 10px 15px;
  }
  &__info {
    margin: 0 auto;
    // max-width: 400px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-around;
  }
  &__table {
    border-spacing: 15px 5px;
    text-align: left;
  }
  &__btn {
    font-size: 1.25em;
  }
}
</style>
