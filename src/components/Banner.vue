<template>
    <div class="banner">
        <div style="flex: 0 0 10%;">logo</div>
        <div id="time_tokens">
            tokens:
            <div ref="time_tokens">{{ time_tokens }}</div>
        </div>
        <button @click="popupProfil = !popupProfil" id="btn_profile"><img src="@/assets/profil.png"></button>
        <div id="windPlayer" v-show="popupProfil">
            <div>{{ playerName }}</div>
            <button @click="logout">Log out</button>
        </div>
    </div>
</template>

<script>

export default {
  name: 'BannerView',
  props: ["playerName", "time_tokens"],
  data() {
    return {
        popupProfil: false,
    }
  },
  methods: {
    logout() {
        this.$router.push('/Login')
    }
  }
}
</script>

<style>

#windPlayer{
    position: absolute;
    top: 60px;
    right: 0px;
    width: 50vw;
    background-color:cornsilk;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    color: black;
    border-radius: 0 0 0 10px;
}


#windPlayer div, button{
    margin: 20px;
}

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

#time_tokens{
    background-color: black;
    border-radius: 30%;
    padding: 10px;
    flex: 0 0 20%;
}

#btn_profile{
    padding: 5px;
    background-color: rgb(0, 0, 0, 0);
    flex: 0 0 10%;
    margin: 0;
    border: 1px solid black;
}
</style>
