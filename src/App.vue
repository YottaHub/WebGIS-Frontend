<template>
  <EarthPane></EarthPane>
</template>

<script>

import EarthPane from "@/components/EarthPane";
export default {
  name: 'App',
  components: {EarthPane}
}
</script>

<style>
html, body {
  width: 100%;
  height: 100%;
  margin: 0px;
  padding: 0px;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0px;
  width: 100%;
  height: 100%;
}
</style>