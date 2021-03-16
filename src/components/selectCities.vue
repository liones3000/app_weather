<template>
  <div class="city__select">
    <ElRow :gutter="20">
      <ElCol :xs="6" :sm="6">
        <ElSelect
          v-model="selectCountry"
          placeholder="Choose country"
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
      <ElCol :xs="16" :sm="16">
        <ElSelect
          v-model="selectCity"
          :disabled="!isEmptyCountry"
          placeholder="Choose city"
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
      <ElCol :xs="2" :sm="2">
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

<style lang="scss" scoped></style>
