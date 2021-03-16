<template>
  <div class="home">
    <ElRow class="search">
      <SelectCities />
    </ElRow>
    <ElRow class="list-wrapper">
      <CityList />
    </ElRow>
  </div>
</template>

<script>
// @ is an alias to /src
import CityList from "@/components/cityList";
import SelectCities from "@/components/selectCities";

export default {
  name: "Home",
  components: {
    CityList,
    SelectCities
  },
  computed: {}
};
</script>

<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css2?family=Roboto&display=swap");

.search {
  margin-bottom: 20px;
}
</style>

<style lang="scss">
.slide-bottom {
  animation: slide-bottom 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}
@keyframes slide-bottom {
  0% {
    transform: translateY(-200%);
    display: none;
  }
  100% {
    transform: translateY(0);
    display: block;
    max-height: auto;
  }
}
@keyframes slide-top {
  0% {
    transform: translateY(0);
    display: block;
    max-height: 0;
  }
  100% {
    transform: translateY(-200%);
    display: none;
    max-height: auto;
  }
}
.city__list .show {
  display: block;
}
.el-select {
  width: 100%;
}
.el-container {
  flex-wrap: wrap;
}

.el-card {
  &__body {
    display: none;
  }
  &__header {
    background: linear-gradient(to top left, #feb020, #ffd05c);
    padding: 0 15px !important;
  }
}
.city__select .el-col {
  margin-bottom: 10px;
  text-align: center;
}
</style>
