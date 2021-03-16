<template>
  <div class="city__list">
    <ElContainer>
      <transition-group name="bounce" tag="div" class="animate">
        <ElCol
          :xs="24"
          :sm="8"
          :md="6"
          v-for="(value, name) in getCities"
          :key="name"
        >
          <CityCard @removeCity="removeCityCard" :city-object="value" />
        </ElCol>
      </transition-group>
    </ElContainer>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import CityCard from "@/components/cityCard";

export default {
  name: "CityList",
  mounted() {
    this.checkCookies();
  },
  components: {
    CityCard
  },
  computed: {
    ...mapGetters("weatherStore", ["getCities"])
  },
  methods: {
    ...mapActions("weatherStore", ["fetchWeather", "deleteCity"]),
    checkCookies() {
      const citisId = this.$cookies.get("city");
      if (citisId) {
        citisId.split(",").forEach(cityId => {
          this.fetchWeather(cityId);
        });
      }
    },
    removeCityCard(value) {
      this.deleteCity(value);
    }
  }
};
</script>

<style lang="scss" scoped>
.animate {
  width: 100%;
}
.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}
</style>
