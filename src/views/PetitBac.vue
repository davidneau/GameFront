<template>
    <div>
        <div id="mainPetitBac">
            <h3 id="divRommId" v-if="roomId">{{ roomId }}</h3>
            <h1 v-show="this.panel !== 'accueil'">Petit Bac</h1>
            <div v-show="this.panel !== 'accueil'" id="letters">
                <span id="A">A</span>
                <span id="B">B</span>
                <span id="C">C</span>
                <span id="D">D</span>
                <span id="E">E</span>
                <span id="F">F</span>
                <span id="G">G</span>
                <span id="H">H</span>
                <span id="I">I</span>
                <span id="J">J</span>
                <span id="K">K</span>
                <span id="L">L</span>
                <span id="M">M</span>
                <span id="N">N</span>
                <span id="O">O</span>
                <span id="P">P</span>
                <span id="Q">Q</span>
                <span id="R">R</span>
                <span id="S">S</span>
                <span id="T">T</span>
                <span id="U">U</span>
                <span id="V">V</span>
                <span id="W">W</span>
                <span id="X">X</span>
                <span id="Y">Y</span>
                <span id="Z">Z</span>
            </div>
            <div v-show="panel == 'accueil'" id="accueil">
                <div>
                    <button @click="dialog = true">Rejoindre une partie</button>
                    <div v-if="dialog" id="popup">
                        <p>Code:</p>
                        <input type="text" @keyup.enter="joinGame"/>
                    </div>
                    <button @click="hostGame">Créer une partie</button>
                </div>
            </div>
            <div v-show="panel == 'lobby'" id="lobby">
                <button @click="ready">Ready</button>
                <div id="divPlayers">
                    <div v-for="player in listPlayer" :key="player.name">
                        <playerCard :name="player.name" :ready="player.ready"></playerCard>
                    </div>
                </div>
                <div>
                    <div id="messages">
                    </div>
                    <div>
                        <input type="text" @keypress.enter="sendMessage">
                    </div>
                </div>
            </div>
            <div v-show="panel == 'game'" id="divGame">
                <div class="flexCol">
                    <h3>Lettre:</h3>
                    <p id="letter"></p>
                </div>
                <div>
                    <h3>Prénom Féminin</h3>
                    <input value="MARINE" type="text" id="prenomsF" @keyup.enter="checkAnswer">
                </div>
                <div>
                    <h3>Prénom Masculin</h3>
                    <input type="text" id="prenomsM" @keyup.enter="checkAnswer">
                </div>
                <div>
                    <h3>Métier</h3>
                    <input type="text" id="metiers" @keyup.enter="checkAnswer">
                </div>
                <div>
                    <h3>Fruit/Légume</h3>
                    <input type="text" id="legumesfruits" @keyup.enter="checkAnswer">
                </div>
                <div>
                    <h3>Pays/Ville</h3>
                    <input type="text" id="paysvilles" @keyup.enter="checkAnswer">
                </div>
                <div>
                    <h3>Célibrité</h3>
                    <input type="text" id="celebrities" @keyup.enter="checkAnswer">
                </div>
                <div class="flexCol">
                    <h3>Score</h3>
                    <p>{{ score }}</p>
                </div>
            </div>
            <div v-show="panel == 'score'" id="divScore">
                <div id="slider">
                    <div id="divRes">
                        <div v-for="i in 6" :key="i" style="width: 16.666666%;">
                            <h1>{{ categories[i-1] }}</h1>
                            <div class="ansDiv">
                                <div v-for="(player, key) in answers" :key="key">
                                    <playerCard :name="player.name" :ready="Object.values(player.ans)[i-1].at(1)" :ans="Object.values(player.ans)[i-1].at(0)"></playerCard>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="prec_suiv">
                    <button :style="{ visibility: cursorPrecSuiv>1 ? 'visible' : 'hidden' }" @click="prec">Précédent</button>
                    <button @click="suiv">Suivant</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { socket } from "@/socket"
import playerCard from '@/components/playerCard.vue';

export default {
  name: 'PetitBacView',
  data(){
    return {
        socket: "",
        nbGoodAnswer: 0,
        roomId: 0,
        listPlayer: [],
        letter: "",
        dialog: false,
        score: 0,
        panel: "accueil",
        answers: [],
        cursorPrecSuiv: 1,
        categories: ["prenomsF", "prenomsM", "metiers", "legumesfruits", "paysvilles", "celebrities"]
    }
  },
  components: {playerCard},
  methods: {
    ready(){
        console.log("ready")
        this.socket.emit("player_ready", { room: this.roomId })
    },
    prec(){
        this.cursorPrecSuiv -= 1
        const slider = document.getElementById("slider")
        slider.scrollBy({
            left: -window.innerWidth
        });
    },
    suiv(){
        this.cursorPrecSuiv += 1
        const slider = document.getElementById("slider")
        if (this.cursorPrecSuiv == 7){
            this.panel = "lobby"
            slider.scrollTo({
                left: 0
            });
        }
        else {
            slider.scrollBy({
                left: window.innerWidth
            });
        }
    },
    checkAnswer(event){
        console.log('check')
        let value = event.target.value
        let cat = event.target.id
        this.socket.emit("check_on", { valeur:value, categorie: cat, room: this.roomId })
    },
    async sendMessage(event){
        let messages = document.getElementById("messages")
        let message = document.createElement("p")
        message.innerText = event.target.value
        messages.appendChild(message)
        console.log("send")
        this.socket.emit("send_message", {
                message: event.target.value,
                room: this.roomId
            }
        )
    },
    endround(){
        this.score += this.nbGoodAnswer
        this.nbGoodAnswer = 0
        this.categories.forEach(el =>{
            document.getElementById(el).parentNode.style.backgroundColor = "grey"
        })
        this.cursorPrecSuiv = 1
    },
    joinGame(event){
        this.roomId = event.target.value
        this.socket.emit("join_game", {
            room: this.roomId
        })
    },
    hostGame(){
        this.socket.emit("create_game")

        this.socket.on("game_created", (data) => {
            console.log(data)
            this.roomId = data.room
            
            this.socket.emit("join_game", {
                room: this.roomId
            })
        })

        this.panel = "lobby"
    }
  },
  mounted() {
    /* const router = useRoute()
    this.roomId = router.params.roomId
    console.log(this.roomId) */
    this.socket = socket.connect()
    // Rejoindre une room

    //this.socket.emit("create_game")

    /* if (!this.roomId){
        console.log("create")
        this.socket.on("game_created", (data) => {
            console.log(data)
            this.roomId = data.room
            routerObj.push(`/petitBac/${data.room}`)
            
            this.socket.emit("join_game", {
                room: this.roomId
            })
        })
    } else {
        console.log("join")
        this.socket.emit("join_game", {
            room: this.roomId
        })
    } */
    
    this.socket.on("players_update", (data) => {
        console.log("player update")
        console.log(data)
        this.listPlayer = []
        this.listPlayer = data
        if (this.panel == 'accueil') this.panel = 'lobby'
    })

    this.socket.on("game_stopped", () => {
        alert("stop")
    })

    this.socket.on("check_receive", data => {
        console.log(data)
        let catId = data.categorie
        let target = document.getElementById(catId).parentNode
        if (data.res == false) target.style.backgroundColor = "red"
        else {
            target.style.backgroundColor = "green"
            this.nbGoodAnswer += 1
            console.log(this.nbGoodAnswer)
            if (this.nbGoodAnswer == 6) {
                console.log("stop")
                this.socket.emit("stop_game", {
                        room: this.roomId
                    }
                )
            }
        }
    })

    this.socket.on("receive_message", (data) => {
        console.log("receive")
        console.log(data.message)
        let messages = document.getElementById("messages")
        let message = document.createElement("p")
        message.innerText = data.message
        messages.appendChild(message)
        this.endround()
    })

    this.socket.on("end_round", (data) => {
        this.panel ="score"
        console.log("receive")
        console.log(data.ans)
        this.answers = data.ans
        this.endround()
    })

    
    this.socket.on("error", (data) => {
        alert(data.message)
    })

    this.socket.on("round_started", (data) => {
        this.panel = "game"
        console.log("go!")
        console.log(data)
        this.letter = data.letter
        document.getElementById("letter").innerHTML = data.letter
        this.categories.forEach(el => {
            console.log(el)
            //document.getElementById(el).value = data.letter
        })
        document.getElementById("divGame").style.display = "block"
        document.getElementById(data.letter).style.color = "green"
    })
  }
}
</script>

<style>
body, html{
    margin: 0
}

#mainPetitBac{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
}

#letters{
    color: red
}

#letters span{
    margin: 1px;
    font-weight: bold;
}

#divRes{
    display: flex;
    flex-direction: row;
    width: 600vw;
}

.ansDiv{
    display: grid;
    grid-template-columns: 50% 50%;
}

.ansDiv>div {
    width: 100%;
}

#slider{
    max-width: 100vw; 
    overflow-x: auto;
    touch-action: pan-y;
}

#divGame {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
}

#divGame {
    background-color: grey;
}

#prec_suiv{
    width: 100vw;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
}

#divRommId{
    position: absolute;
    top: 70px;
    left: 10px;
    border: 1px solid black;
    border-radius: 5px;
    background-color: white
    ;
}

#lobby {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
}

.flexCol {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
}

#divPlayers{
    width: 100%;
}

#divScore {
  overflow-x: auto;
  scrollbar-width: none; /* Firefox */
}

#divScore::-webkit-scrollbar {
  display: none; /* Chrome */
}

#popup{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border: 1px solid black;
    border-radius: 10px;
    padding: 20px;
    background-color: aquamarine;
}
</style>
