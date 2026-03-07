<template>
    <div class="banner">
        <div>logo</div>
        {{  playerName }}
        <button @click="logout">Log out</button>
    </div>
</template>

<script>

export default {
  name: 'BannerView',
  props: ["playerName"],
  methods: {
    logout() {
        this.$router.push('/Login')
    }
  }
}
</script>

<style>
.banner {
    background-color: blue;
    width: 100%;
    height: 60px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    color: white;
}
</style>
