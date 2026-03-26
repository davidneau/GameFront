<template>
    <div>
        <div id="loginPage">
            <div id="divLogin">
                <p>pour tester le site : id: Test, mdp: Test </p>
                <h1>Login</h1>
                <h2>Id</h2>
                <input type="text" id="identifiant"/>
                <h2>Password</h2>
                <input type="password" id="password" @keypress.enter="enter"/>
                <button @click="enter">Enter</button>
                <button @click="signIn">S'inscrire</button>
                <button @click="signUp">Se connecter</button>
            </div>
        </div>
    </div>
</template>


<script>
import { login, getProfile } from '../api';

export default ({
    name: "LoginPage",
    methods: {
        enter(){
            let identifiant = document.getElementById("identifiant").value
            let password = document.getElementById("password").value
            console.log(identifiant)
            console.log(password)

            login(identifiant, password)
            .then((data) => {
                localStorage.setItem('playerName', identifiant);
                localStorage.setItem("time_tokens", data.time_token)
                return getProfile();
            })
            .then(profile => {
                this.$emit('switchUserConnected')
                console.log(profile.data); // Affiche les infos de l'utilisateur
                this.$router.push('/')
            })
            .catch(err => {
                console.error('Erreur:', err.response);
                alert("mot de passe ou identifiant erroné")
            });
        },
        signIn(){
            this.$router.push('signIn')
        },
        signUp(){
            this.$router.push('signUp')
        }
    }
})
</script>

<style>

h1, h2 {
    margin: 0;
}

#loginPage{
    display: flex;
    justify-content: center; /* horizontal */
    align-items: center;     /* vertical */
    height: calc(100vh - 60px);
}

#divLogin{
    height: 250px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    background-color: #00ebff;
    border-radius: 15px;
}

#divLogin input{
    width: 60% !important;
}

@media screen and (min-width: 428px)  {
    #divLogin{
        height: 350px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        background-color: #00ebff;
        border-radius: 15px;
        width: 15%;
    }
}
</style>