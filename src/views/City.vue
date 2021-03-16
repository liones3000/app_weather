<template>
  <div class="city">
    <template v-if="!isExist">
      <p
        v-loading.fullscreen.lock="isExist"
        element-loading-text="Loading..."
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
      ></p>
    </template>
    <template v-else>
      <div class="city__header">
        <div class="city__icon">
          <img
            class="city__img"
            :src="fetchIcon"
            :alt="weatherData.weather[0].main"
          />
        </div>
        <div class="city__text">
          <h2 class="city__title">
            Город, страна: {{ weatherData.name }},
            {{ weatherData.sys.country }}
          </h2>
          <p class="city__descr">
            <b>Погодные условия:</b> {{ weatherData.weather[0].description }}
          </p>
        </div>
      </div>

      <div class="city__info">
        <div class="city__table">
          <nav class="city__nav">
            <ElLink
              @click="backtoPage"
              class="city__btn"
              type="warning"
              aria-label="link to go back"
              ><i class="el-icon-back"></i> Назад
            </ElLink>
          </nav>
          <table class="city__table table">
            <tbody>
              <tr class="table__row">
                <th colspan="2" class="table__header">Информация</th>
              </tr>
              <tr class="table__row">
                <td class="table__key">
                  Ощущается как
                </td>
                <td class="table__value">
                  {{ weatherData.main.feels_like }}&#176;C
                </td>
              </tr>
              <tr class="table__row">
                <td class="table__key">
                  Ветер
                </td>
                <td class="table__value">
                  {{ weatherData.wind.speed }} м/с,
                  {{ weatherData.wind.deg }} &#176;
                </td>
              </tr>
              <tr class="weather-right-card__items">
                <td class="table__key">
                  Влажность
                </td>
                <td class="table__value">{{ weatherData.main.humidity }}%</td>
              </tr>
              <template v-if="!!weatherData.rain">
                <tr class="weather-right-card__items">
                  <td class="table__key">
                    Дождь
                  </td>
                  <td class="table__value">{{ weatherData.rain["1h"] }} мм</td>
                </tr>
              </template>
              <tr class="weather-right-card__items">
                <td class="table__key">
                  Давление
                </td>
                <td class="table__value">
                  {{ weatherData.main.pressure }} hPa
                </td>
              </tr>
              <tr class="weather-right-card__items">
                <td class="table__key">
                  Видимость
                </td>
                <td class="table__value">{{ weatherData.visibility }} м.</td>
              </tr>
              <tr class="weather-right-card__items">
                <td class="table__key">
                  Облачность
                </td>
                <td class="table__value">{{ weatherData.clouds.all }} %</td>
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
                  {{ sunTime(weatherData.sys.sunrise) }}
                </td>
              </tr>
              <tr class="weather-right-card__items">
                <td class="table__key">
                  Закат
                </td>
                <td class="table__value">
                  {{ sunTime(weatherData.sys.sunset) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="city__charts">
          <template v-if="!isExist"></template>
          <template v-else>
            <Charts
              :chart-data="dataForCharts"
              :options="optionsForCharts"
              :is-render="isRenderCharts"
            />
          </template>
        </div>
      </div>
    </template>
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
  watch: {
    getCities: {
      handler: "checkId",
      deep: true,
      immediate: true
    }
  },
  mounted() {},
  data: () => ({
    isExistsID: "",
    chartData: {
      labels: [],
      datasets: [
        {
          label: "Часы",
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

    // Кнопка вернуться назад по истории открытия страниц
    backtoPage() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
    },

    // Проверка на существование данных для отображения
    checkId(value) {
      if (!value[this.id]) {
        this.isExistsID = false;
        this.fetchWeather(this.id);
        return;
      }
      this.isExistsID = true;
      this.fetchHour();
    },

    // Изменение данных о времени восхода и заката для отображения в таблице
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

    // Запрос по имеющимся данным lat и lon для получения данных почасовой температуры.
    async fetchHour() {
      const lat = this.weatherData.coord.lat;
      const lon = this.weatherData.coord.lon;
      try {
        const response = await axios.get(`onecall`, {
          params: {
            lat,
            lon,
            exclude: "current,minutely,alerts"
          }
        });
        // Создаем объект с ключом = время unix, и значением = температурой
        const result = await serializeHourlytemp(response.hourly);

        //Получаем массив с данными времени для отображения в графике
        const dataLabels = Object.keys(result).reduce((acc, el) => {
          const newDate = new Date(Number(el) * 1000);
          const hours = newDate.getHours().toString();
          acc.push(hours);
          return acc;
        }, []);
        // Получаем массив с данными температуры для отображения в графике
        const dataSets = Object.values(result).reduce((acc, el) => {
          acc.push(el);
          return acc;
        }, []);

        // Записываем в data -> chartData -> labels массив с данными для оси X
        this.chartData.labels = dataLabels;

        // Записываем в data -> datasets -> data массив с данными для оси Y
        this.chartData.datasets[0].data = dataSets;

        // передаем информацию о запуске рендера графика
      } catch (err) {
        console.log("fetchHour:", err);
        Promise.reject(err);
      }
    }
  },
  computed: {
    ...mapGetters("weatherStore", ["getCities", "getIconUrl"]),

    // Проверка на существование данных для показа
    isExist() {
      return this.isExistsID;
    },

    // возвращает данные для отображения. Если в сторе нет данного города, делает запрос на данные и записывает в стору.
    weatherData() {
      return this.getCities[this.id];
    },
    // формирует ссылку для иконки
    fetchIcon() {
      if (!this.weatherData) return; // проверка на существование
      return `${this.getIconUrl}${this.weatherData.weather[0].icon}.png`;
    },

    // Изменение данных о последнем обновлении информации для отображения в таблице
    updateData() {
      if (!this.weatherData) return; // проверка на существование
      const date = new Date(this.weatherData.dt * 1000);
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
    },
    dataForCharts() {
      return this.chartData;
    },
    optionsForCharts() {
      return this.options;
    },
    isRenderCharts() {
      return this.chartData.labels.length > 10 ? true : false;
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
    margin: 0 auto;
    padding: 10px 15px;
    @media (max-width: 400px) {
      flex-direction: column;
    }
  }
  &__text {
    flex-shrink: 0;
  }
  &__title {
    font-size: 16px;
    padding: 5px 5px;
    margin: 0;
  }
  &__descr {
    margin: 0;
    padding: 5px 5px;
  }
  &__img {
    width: 100%;
  }
  &__info {
    margin: 0 auto;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    @media (max-width: 768px) {
      flex-direction: column;
    }
  }
  &__table {
    border-spacing: 15px 5px;
    text-align: left;
    font-size: 18px;
    margin-bottom: 20px;
  }
  &__charts {
    width: 100%;
    overflow-y: auto;
    max-width: 500px;
  }
  &__btn {
    font-size: inherit;
  }
  &__nav {
    text-align: center;
    padding: 15px 5px;
  }
}
.table {
  &__value {
    font-weight: bold;
  }
}
</style>
