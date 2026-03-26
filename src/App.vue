<template>
  <Banner :playerName="playerName"  :time_tokens="time_tokens"></Banner>
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
        playerName: "",
        time_tokens: 0.00,
    }
  },
  mounted() {
    console.log(localStorage.getItem('playerName'))
    this.playerName = localStorage.getItem('playerName')
    console.log(localStorage.getItem('time_tokens'))
    this.time_tokens = localStorage.getItem('time_tokens')
  }
}
</script>

<style>

#routerView{
    height: calc(100vh - 60px);
}
</style>
