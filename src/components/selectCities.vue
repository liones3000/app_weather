<template>
  <div class="city__select">
    <ElRow :gutter="20" class="city__row">
      <ElCol :xs="24" :sm="6" :md="6" :lg="4">
        <ElSelect
          v-model="selectCountry"
          placeholder="Выберите код страны"
          no-match-text="false"
          filterable
          default-first-option
        >
          <ElOption
            v-for="(item, index) in countryList"
            :key="index"
            :label="item"
            :value="item"
            autocomplete
          ></ElOption>
        </ElSelect>
      </ElCol>
      <ElCol :xs="24" :sm="16" :md="16" :lg="14">
        <ElSelect
          v-model="selectCity"
          :disabled="!isEmptyCountry"
          placeholder="Выберите город"
          filterable
          default-first-option
        >
          <ElOption
            v-for="item in cityListOfCountry"
            :key="item.id"
            :label="item.name"
            :value="item.id"
            autocomplete
          ></ElOption>
        </ElSelect>
      </ElCol>
      <ElCol :xs="24" :sm="2" :md="2" :lg="2">
        <ElButton
          icon="el-icon-plus"
          type="success"
          :disabled="!isEmptyCity"
          @click="addCity"
        ></ElButton>
      </ElCol>
    </ElRow>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "SelectCities",
  data: () => ({
    selectCity: "",
    selectCountry: ""
  }),
  methods: {
    ...mapActions("weatherStore", ["fetchWeather"]),
    addCity() {
      if (!this.selectCity) return;
      this.fetchWeather(this.selectCity);
      // console.log(this.selectCity);
    }
  },
  computed: {
    ...mapGetters("weatherStore", ["getCountryList"]),
    countryList() {
      let array = Object.keys(this.getCountryList);
      return array;
    },
    isEmptyCountry() {
      return Boolean(this.selectCountry);
    },
    isEmptyCity() {
      return Boolean(this.selectCity);
    },
    cityListOfCountry() {
      return this.getCountryList[this.selectCountry];
    }
  }
};
</script>

<style lang="scss" scoped>
.city {
  // &__row {
  //   width: 100%;
  //   display: flex;
  //   justify-content: center;
  //   @media (max-width: 767px) {
  //     display: table;
  //   }
  // }
}
</style>
