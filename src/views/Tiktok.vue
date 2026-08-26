<template>
    <div>
        <div id="mainTiktok">
            <div id="bannerTiktok">
                <input id="inputTiktokLive" type="text">
                <button @click='fetchTiktokLive("NA")'>Ok</button>
            </div>
            <div id="Tiktok">
                <div id="usersTiktok">
                    <div v-for="user in userList" :key="user">
                        <button class="userDiv" :id="user" @click="fetchTiktokLive(user)">
                            {{ user }}
                        </button>
                    </div>
                </div>
                <div id="divPlayer">
                    <video ref="videoPlayer" controls autoplay></video>
                </div>
                <div id="commentsTiktok"></div>
            </div>
        </div>
    </div>
</template>

<script>
import flvjs from 'flv.js';
import { getTiktokLive, isLiving } from '@/api';

export default {
  name: 'TiktokView',
  data() {
    return {
      streamUrl: null,
      flvPlayer: null,
      userList: [
            "jonathanwadoux7",
            "sullypapillon1",
            "kevin.kerchaoui7",
            "19781962.2",
            "mystiquefantastique",
            "miss.gay.caleuche",
            "coralie62100",
            "missracaille6259",
            "miss.jazz.artiste",
            "trollagency5",
            "missjazzetmisscoco",
            "coraliedu62",
            "valou_bmw",
            "orkanouille",
            "tqoquento",
            "lapetitecolline",
            "jnr6580",
            "bea_vjlap2",
            "eclipsea023"
        ]
    };
  },
  methods: {
    async isUsersLiving(){
        this.userList.forEach( user => {
            console.log(user)
            isLiving(user).then( response => {
                console.log(response)
                console.log(user)
                if (response.data == "True") {
                    document.getElementById(user).style.backgroundColor = "green"
                }
            })
        })
    },
    fetchTiktokLive(user_id){
        let user
        if (user_id == "NA") user = document.getElementById("inputTiktokLive").value
        else user = user_id
        getTiktokLive(user)
        .then(response => {
            console.log(response)
            this.streamUrl = response.data
            this.play()
        })
    },
    play() {
        if (flvjs.isSupported()) {
        const videoElement = this.$refs.videoPlayer;
        this.flvPlayer = flvjs.createPlayer({
            type: 'flv',
            url: this.streamUrl,
            isLive: true
        });
        this.flvPlayer.attachMediaElement(videoElement);
        this.flvPlayer.load();
        this.flvPlayer.play();
        } else {
        console.error('flv.js non supporté par ce navigateur');
        }
    },
  },
  mounted(){
    this.isUsersLiving()
  },
  beforeUnmount() {
    if (this.flvPlayer) {
      this.flvPlayer.destroy();
    }
  }
};
</script>

<style>

#mainTiktok{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    width: 100%;
}

#bannerTiktok{
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 60px;
    background-color: black;
}

#Tiktok{
    height: calc(100% - 60px);
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
}

#divPlayer{
    height: 100%;
    width: 60%;
}

#divPlayer video{
    height: 100%;
    width: 100%;
}

#usersTiktok {
    background-color: white;
    width: 20%;
    height: 100%;
}

#commentsTiktok {
    background-color: white;
    width: 20%;
    height: 100%;
}

.userDiv{
    background-color: red;
    border-radius: 1px black solid;
    margin: 5px;
    border-radius: 10px;
    height: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    font-weight: bold;
    width: calc(100% - 10px);
}
</style>