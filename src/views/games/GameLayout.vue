<template>
  <div class="game-page">
    <header class="game-header">
      <img :src="`/images/games/${game}.jpg`" :alt="game" class="cover" />
      <div>
        <h1>{{ game }}</h1>
        <p>Arcade • Solo • 2 min</p>
      </div>
      <button class="play-btn" @click="play">Jouer</button>
    </header>

    <main class="tab-content">
      <RouterView />
    </main>
    
    <div class="divTabs">
        <nav class="tabs">
        <RouterLink :to="`/jeux/${game}`">Aperçu</RouterLink>
        <RouterLink :to="`/jeux/${game}/regles`">Règles</RouterLink>
        <RouterLink :to="`/jeux/${game}/commentaires`">Avis</RouterLink>
        <RouterLink :to="`/jeux/${game}/classement`">Classement</RouterLink>
        </nav>
    </div>
  </div>
</template>

<script>
import { useRoute } from 'vue-router'

export default {
  name: 'GamePresentation',
  props: {
  },
  data(){
    return{
        game: ""
    }
  },
  methods: {
    play(){
        console.log("a")
        this.$router.push('/jeux/petitBac/play');
    }
  },
  mounted(){
    const route = useRoute()
    this.game = route.params.game
    console.log(this.game)
  }
}
</script>

<style scopped>
.game-header{
    width: 100%;
    background-color: brown;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
}

.play-btn{
    background-color: green;
    color: white;
    border-radius: 10px;
    border: 1px solid black;
    padding: 10px;
    font-size: 20px;
    font-weight: bold;
}

.tabs{
    max-width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    overflow: auto;
}

.tabs>a{
    background-color: orangered;
    color: white;
    border-radius: 10px;
    border: 1px solid black;
    padding: 10px;
    font-size: 20px;
    font-weight: bold;
    text-decoration: none;
}

.divTabs{
    background-color: brown;
    width: 100%;
    padding: 10px;
}
</style>