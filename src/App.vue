<template>
  <div id="app">
    <nav id="nav">
      <router-link to="/"> <i class="el-icon-s-home"></i> Home</router-link>
    </nav>
    <transition name="component-fade" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

<style lang="scss">
body {
  margin: 0;
}
.wrap {
  width: 100%;
  overflow: hidden;
  min-height: 100vh;
}
#app {
  font-family: Arial, Helvetica, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

#app {
  max-width: 1368px;
  padding: 0 10px;
  margin: 0 auto;
}

#nav {
  padding: 10px;
  text-align: center;

  a {
    font-weight: bold;
    text-decoration: none;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

.component-fade-enter-active,
.component-fade-leave-active {
  transition: opacity 0.3s ease;
}
.component-fade-enter,
.component-fade-leave-to {
  opacity: 0;
}
</style>
