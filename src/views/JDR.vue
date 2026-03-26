<template>
    <div>
        <button @click="popupAddMonster = true">Add Monster</button>
        <div id="popupAddMonster" v-show="popupAddMonster">
            <button @click="popupAddMonster = false">Fermer</button>
            <!-- <div>
                <p>Initiative</p>
                <input type="text" id="mInit">
            </div> -->
            
            <div>
                <p>Name</p>
                <input type="text" id="mName">
            </div>
            
            <div>
                <p>CA</p>
                <input type="text" id="mCA">
            </div>
            <button @click="addMonster">Valider</button>
        </div>
        <div v-for="(perso, key) in persos" :key="key">
            <div class="divPerso">
                <div><input @change="changeInit" type="text" v-model=perso.init></div>
                <div>{{perso.name}}</div>
                <div>{{perso.CA}}</div>
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
            persos: [
                {
                    name: "Yuki",
                    init: 20,
                    CA: 13
                },
                {
                    name: "Enguerrand",
                    init: 15,
                    CA: 13
                },
                {
                    name: "Velours",
                    init: 10,
                    CA: 13
                },
                {
                    name: "Drazen",
                    init: 5,
                    CA: 13
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
            let json = {
                    name: Name,
                    init: Init,
                    CA: CA
            }
            let index = 0
            for (let perso of this.persos){
                // déplacer B (index 1) à la position 3
                if (Init >= parseInt(perso.init)){
                    this.persos.splice(index, 0, json);
                    console.log(this.persos)
                    break;
                }
                else index += 1
            }
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
                // déplacer B (index 1) à la position 3
                if (newValue >= perso.init){
                    this.persos.splice(index, 0, element);
                    console.log(this.persos)
                    break;
                }
                else index += 1
            }
        }
    },
    mounted(){
    }
}
</script>

<style>
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
    height: 50vh;
    width: 60vw;
    padding: 10px;
}

.divPerso {
    background-color: white;
    width: 80vw;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
}
</style>
