<template>
    <div>
        <div :class="cardClass" class="playerClass" :id="`player-${name}`">
            <h3>{{ name }}</h3>
            <p>{{ ans }}</p>
        </div>
    </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    name: String,
    ready: Boolean,
    ans: String,
    ansRes: String
  },
  computed: {
    cardClass() {
        if (this.ready == "Good") return "good"
        if (this.ready == "Draw") return "draw"
        if (this.ready == "Bad") return "bad"
        return ''
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

h3{
    margin: 0;
}

.good {
    background-color: lightgreen;
}

.bad {
    background-color: red;
}

.playerClass {
    border: 2px solid black;
    border-radius: 15px;
    margin: 10px;
    padding: 5px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    height: 60px;
}
</style>
