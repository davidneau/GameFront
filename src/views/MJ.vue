<template>
    <div>
        <div class="headerJDR">
            <button @click="popupAddMonster = true">Add Monster</button>
            <div id="divTurn">Turn : {{ nbTurn }}</div>
        </div>
        <div id="popupDelChar" v-show="deletePersoPopup">
            Do you want to delete this character?
            <div>
                <button @click="deletePerso">Yes</button>
                <button @click="deletePersoPopup = false">No</button>
            </div>
        </div>
        <div id="popupAddMonster" v-show="popupAddMonster">
            <button @click="popupAddMonster = false">Fermer</button>
            <div>
                <p>Name</p>
                <input type="text" id="mName">
            </div>
            <div>
                <p>CA</p>
                <input type="text" id="mCA">
            </div>
            <div>
                <p>PV</p>
                <input type="text" id="mPV">
            </div>
            <div>
                <p>Type</p>
                <select id="mType">
                    <option value="familier">Familier</option>
                    <option value="monstre">Monstre</option>
                </select>
            </div>
            <button @click="addMonster">Valider</button>
        </div>
        <button id="nextTurn" @click="next">Next</button>
        <div id="divMainJDR">
            <div class="divPerso" style="background-color:cadetblue; opacity: 1;">
                <div><strong>Initiative</strong></div>
                <div><strong>Nom</strong></div>
                <div><strong>CA</strong></div>
                <div><strong>PV</strong></div>
            </div>
            <div v-for="(perso, index) in persos" :key="index" :class="{ active: index === selectedIndex }">
                <div class="divPerso" :class="perso.type">
                    <div><input @change="changeInit" type="text" v-model=perso.init></div>
                    <div>{{perso.name}}</div>
                    <div class="pv">
                        <input type="text" v-model=perso.CA>
                        <div >
                            <button @click="incremente(perso.name, 'CA')" style="background-color: green;">+</button>
                            <button @click="decremente(perso.name, 'CA')" style="background-color: red;">-</button>
                        </div>
                    </div>
                    <div class="pv">
                        <input type="text" v-model=perso.PV>
                        <div >
                            <button @click="incremente(perso.name, 'PV')" style="background-color: green;">+</button>
                            <button @click="decremente(perso.name, 'PV')" style="background-color: red;">-</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name: "jdrGame",
    data(){
        return {
            popupAddMonster: false,
            deletePersoPopup: false,
            deletePersoIndex: 0,
            selectedIndex: 0,
            nbTurn: 1,
            persos: [
                {
                    name: "Yuki",
                    init: 20,
                    CA: 13,
                    PV: 20,
                    type: "player"
                },
                {
                    name: "Enguerrand",
                    init: 15,
                    CA: 13,
                    PV: 20,
                    type: "player"
                },
                {
                    name: "Velours",
                    init: 10,
                    CA: 13,
                    PV: 20,
                    type: "player"
                },
                {
                    name: "Drazen",
                    init: 5,
                    CA: 13,
                    PV: 1,
                    type: "player"
                },
            ]
        }
    },
    methods: {
        indexInList(name){
            let index = 0
            for (let perso of this.persos){
                if (perso.name == name) return index
                else index += 1
            }
        },
        addMonster(){
            let Init = Math.floor(Math.random() * 20) + 1
            let Name = document.getElementById("mName").value
            let CA = document.getElementById("mCA").value
            let pv = document.getElementById("mPV").value
            let type = document.getElementById("mType").value
            let json = {
                    name: Name,
                    init: Init,
                    CA: CA,
                    PV: pv,
                    type: type
            }
            let index = 0
            for (let perso of this.persos){
                if (Init >= parseInt(perso.init)){
                    this.persos.splice(index, 0, json);
                    console.log(this.persos)
                    break;
                }
                else index += 1
            }
            if (index == this.persos.length) this.persos.splice(index, 0, json);
            this.popupAddMonster = false
        },
        changeInit(e){
            let newValue = e.target.value
            let index = 0
            let persoIndex = this.indexInList(e.target.parentNode.parentNode.children[1].innerText)
            console.log(persoIndex)
            const element = this.persos.splice(persoIndex, 1)[0];
            console.log(element)
            for (let perso of this.persos){
                if (newValue >= perso.init){
                    this.persos.splice(index, 0, element);
                    console.log(this.persos)
                    break;
                }
                else index += 1
            }
            console.log(index)
            console.log(this.persos.length)
            if (index == this.persos.length) {
                console.log("a")
                this.persos.splice(index, 0, element);
            }
        },
        incremente(name, cat){
            console.log(name)
            for (let perso of this.persos){
                if (name == perso.name){
                    if (cat == "PV") perso.PV += 1
                    else perso.CA += 1
                }
            }
        },
        decremente(name, cat){
            console.log(name)
            let index = 0
            for (let perso of this.persos){
                if (name == perso.name){
                    if (cat == "PV") perso.PV -= 1
                    else perso.CA -= 1
                }
                console.log(perso.PV)
                if (perso.PV == 0) {
                    this.deletePersoIndex = index
                    this.deletePersoPopup = true
                }
                index += 1
            }
        },
        deletePerso(){
            this.persos.splice(this.deletePersoIndex, 1)[0];
            this.deletePersoPopup = false
        },
        next(){
            this.selectedIndex += 1;
            this.selectedIndex = this.selectedIndex % this.persos.length
            if (this.selectedIndex == 0) this.nbTurn += 1
        }
    },
    mounted(){
    }
}
</script>

<style>
#divMainJDR{
    height: 60vh;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    width: 50%;
}

#divMainJDR>div{
    width: 70%;
}

.headerJDR{
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    width: 50%;
}

#popupDelChar{
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    background-color: cadetblue;
    border-radius: 10px;
    border: 1px solid black;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 10px;
    z-index: 2;
}

#popupDelChar>div{
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    margin-top: 10px;
}

#popupDelChar button{
    margin: 5px;
}

#popupAddMonster{
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    background-color: cadetblue;
    border-radius: 10px;
    border: 1px solid black;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    height: 40vh;
    width: 20vw;
    padding: 10px;
    z-index: 2;
}

.divPerso {
    background-color: white;
    width: 100%;
    padding: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    border-radius: 10px;
    border: 1px solid black;
    opacity: 0.5;
}

.pv {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
}

.pv>input {
    width: 60% !important;
}

.pv>div {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    height: 100%;
    width: 20%;
}

.pv>div>button {
    margin: 0;
    padding: 0;
    width: 100%;
    color: white;
    border-radius: 2px;
}

.divPerso>div:first-child{
    width: 20%;
}


.divPerso>div:nth-child(2){
    width: 30%;
}


.divPerso>div:nth-child(3){
    width: 10%;
}


.divPerso>div:nth-child(4){
    width: 10%;
}

.divPerso>div>input:first-child{
    width: 100%;
    text-align: center;
}

.player {
    background-color: lightgreen;
}

.monstre{
    background-color: darkgrey;
}

.familier{
    background-color: lightyellow;
}

.active>div {
  opacity: 1 !important;
  font-weight: bold;
}

#nextTurn{
    position: absolute;
    right: 10px;
    bottom: 10px;
}

#divTurn {
    background-color: white;
    border: 1px solid red;
    border-radius: 10px;
    padding: 10px;
    font-weight: bold;
    font-size: 20px;
}
</style>
