<template>
    <div>
        <div id="bannerSearch">
            <div v-if="userConnected">
                <input type="text" id="search" @keyup.enter="search" ref="searchInput" value="21 pilots">
                <button @click="search(true)">Search</button>
            </div>
        </div>
        <div id="divLoginSingin">
            <h1>Login</h1>
            <h2>Email</h2>
            <input type="text" id="identifiant"/>
            <h2>Mot de passe</h2>
            <input type="password" id="password1"/>
            <h2>Confirmation du mot de passe</h2>
            <input type="password" id="password2" @keypress.enter="enter"/>
            <p id="error">Les deux mots de passes ne correspondent pas</p>
            <button @click="enter">Valider</button>
        </div>
    </div>
</template>


<script>
import { signInUser } from '../api';

export default ({
    name: "LoginPage",
    methods: {
        enter(){
            let identifiant = document.getElementById("identifiant").value
            let password1 = document.getElementById("password1").value
            let password2 = document.getElementById("password2").value
            console.log(identifiant)
            console.log(password1)

            if(password1 == password2){
                signInUser(identifiant, password1)
                .then((response) => {
                    console.log(response.data)
                    this.$router.push('/login')
                })
                .catch(err => {
                    console.error('Erreur:', err.response);
                });
            }
            else {
                document.getElementById("error").style.visibility = "visible"
            }
        }
    }
})
</script>

<style>

h1, h2 {
    margin: 0;
}

#divLoginSingin{
    margin-left: 25%;
    width: 50%;
    margin-top: 200px;
    height: 250px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    background-color: #00ebff;
    border-radius: 15px;
}

#error{
    color: red;
    visibility: hidden;
}

#divLoginSingin input{
    width: 90% !important;
}

@media screen and (min-width: 428px)  {
    #divLoginSingin{
        margin-left: 45%;
        width: 10%;
        margin-top: 200px;
        height: 250px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        background-color: #00ebff;
        border-radius: 15px;
    }
}
</style>