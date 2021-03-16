<template>
  <div class="city__card card" @click="showDetails">
    <ElCard shadow="hover" class="card__wrap" :body-style="{ padding: '10px' }">
      <div class="card__header" slot="header">
        <ElButton
          class="card__btn--close el-icon-close"
          aria-label="remove city info"
          @click="removeItem(cityObject.id)"
        ></ElButton>
        <div class="card__text">
          <h2 class="card__title">
            {{ cityObject.name }}, {{ cityObject.sys.country }}
          </h2>
          <p class="card__descr">
            {{ cityObject.weather[0].description }},
            {{ cityObject.main.temp }}&#176;C
          </p>
        </div>
        <div class="card__icone">
          <img
            class="card__img"
            :src="fetchIcon"
            :alt="cityObject.weather[0].main"
          />
        </div>
      </div>
      <div class="card__body">
        <div class="card__temp">{{ cityObject.main.temp }}&#176;C</div>
        <div class="card__details">
          <table class="card__table table">
            <tbody>
              <tr class="table__row">
                <th colspan="2" class="table__header">Детали</th>
              </tr>
              <tr class="table__row">
                <td class="table__key">
                  Ощущается как
                </td>
                <td class="table__value">
                  {{ cityObject.main.feels_like }}&#176;C
                </td>
              </tr>
              <tr class="table__row">
                <td class="table__key">
                  Ветер
                </td>
                <td class="table__value">{{ cityObject.wind.speed }} m/s</td>
              </tr>
              <tr class="weather-right-card__items">
                <td class="table__key">
                  Влажность
                </td>
                <td class="table__value">{{ cityObject.main.humidity }}%</td>
              </tr>
              <tr class="weather-right-card__items">
                <td class="table__key">
                  Осадки
                </td>
                <td class="table__value">
                  <template v-if="isPrecip">
                    {{ cityObject.precipitation.mode }},
                    {{ cityObject.precipitation.value }} mm
                  </template>
                </td>
              </tr>
              <tr class="weather-right-card__items">
                <td class="table__key">
                  Давление
                </td>
                <td class="table__value">{{ cityObject.main.pressure }} hPa</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="card__footer">
        <ElButton
          class="card__btn card__btn--rotate"
          icon="el-icon-refresh"
          circle
          aria-label="Refresh"
          size="small"
          type="primary"
          @click="refreshData(cityObject.id)"
        ></ElButton>
        <ElLink
          :underline="false"
          class="card__link"
          type="warning"
          aria-label="link to more info"
          title="link to more info"
          @click="linkToCity(cityObject.id)"
        >
          Подробнее
        </ElLink>
      </div>
    </ElCard>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "CityCard",
  props: {
    cityObject: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    ...mapActions("weatherStore", ["fetchWeather"]),
    refreshData(id) {
      this.fetchWeather(id);
    },
    linkToCity(id) {
      this.$router.push({
        name: "City",
        params: {
          id
        }
      });
    },
    removeItem(id) {
      this.$emit("removeCity", id);
    },
    showDetails(e) {
      if (!e.target.closest(".el-card__header")) {
        return;
      }

      const header = e.target.closest(".el-card__header");
      const body = header.nextElementSibling;
      body.classList.toggle("show");
    }
  },
  computed: {
    ...mapGetters("weatherStore", ["getIconUrl"]),
    city() {
      console.log(this.cityObject());
      return this.cityObject;
    },
    fetchIcon() {
      return `${this.getIconUrl}${this.cityObject.weather[0].icon}.png`;
    },
    isPrecip() {
      return this.cityObject.precipitation?.mode;
    }
  }
};
</script>

<style lang="scss" scoped>
@keyframes shake-bottom {
  0%,
  100% {
    transform: rotate(0deg);
    transform-origin: 50% 100%;
  }
  10% {
    transform: rotate(2deg);
  }
  20%,
  40%,
  60% {
    transform: rotate(-4deg);
  }
  30%,
  50%,
  70% {
    transform: rotate(4deg);
  }
  80% {
    transform: rotate(-2deg);
  }
  90% {
    transform: rotate(2deg);
  }
}
@keyframes heartbeat {
  from {
    transform: scale(1);
    transform-origin: center center;
    animation-timing-function: ease-out;
  }
  10% {
    transform: scale(0.91);
    animation-timing-function: ease-in;
  }
  17% {
    transform: scale(0.98);
    animation-timing-function: ease-out;
  }
  33% {
    transform: scale(0.87);
    animation-timing-function: ease-in;
  }
  45% {
    transform: scale(1);
    animation-timing-function: ease-out;
  }
}
@keyframes rotate-scale-down {
  0% {
    transform: scale(1) rotateZ(0);
  }
  50% {
    transform: scale(0.5) rotateZ(180deg);
  }
  100% {
    transform: scale(1) rotateZ(360deg);
  }
}

.card {
  font-family: "Roboto", sans-serif;
  padding: 0 10px 10px 0;
  position: relative;

  &__btn {
    &--close {
      position: absolute;
      right: 15px;
      top: 5px;
      font-size: 1.5em;
      font-weight: 600;
      padding: 0;
      border: none;
      background: transparent;
      &:focus,
      &:hover {
        background: transparent;
        color: #f56c6c;
        animation: heartbeat 1.5s ease-in-out infinite both;
      }
    }
    &--rotate {
      &:hover {
        animation: rotate-scale-down 0.65s linear both;
      }
    }
  }
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  &__text {
    text-align: left;
    flex-shrink: 0;
    max-width: 200px;
  }
  &__title {
    font-size: 18px;
    line-height: 1.5;
    margin: 0;
    cursor: pointer;
    &:hover {
      animation: shake-bottom 0.8s cubic-bezier(0.455, 0.03, 0.515, 0.955) both;
    }
  }
  &__descr {
    margin: 0;
    font-size: 14px;
    line-height: 1.5;
  }
  &__img {
    width: 100%;
  }
  &__icone {
    width: 30%;
  }
  &__body {
    display: flex;
    align-items: center;
    justify-content: space-between;
    overflow: hidden;
  }
  &__temp {
    font-size: 40px;
    margin: 0 auto;
  }
  &__details {
    flex-shrink: 0;
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-weight: 600;
  }
  &__link {
    font-size: 16px;
  }
}
.table {
  text-align: left;
  font-size: 12px;
  &__value {
    font-weight: 600;
  }
}
</style>
