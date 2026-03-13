<template>
    <div>
        <router-link to="/jeux/petitBac/">Petit Bac</router-link>
        <router-link to="/sudoku">Sudoku</router-link>
        <router-link to="/patateChaude">Patate Chaude</router-link>
    </div>
</template>

<script>

export default {
  name: 'HomeView'
}
</script>

<style>

#routerView {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    background-color: darkred;
}

#routerView>a{
    background-color: aqua;
    padding: 30px 0;
    border-radius: 15px;
    text-decoration: none;
    color: black;
    width: 80%;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 20px;
    font-weight: bold;
}
</style>
