<template>
  <Banner :playerName="playerName"></Banner>
  <router-view id="routerView"/>
</template>

<script>
import Banner from './components/Banner.vue';

export default {
  name: 'App',
  components: {
    Banner
  },
  data() {
    return {
        playerName: ""
    }
  },
  mounted() {
    console.log(localStorage.getItem('playerName'))
    this.playerName = localStorage.getItem('playerName') 
  }
}
</script>

<style>

#routerView{
    height: calc(100vh - 60px);
}
</style>
