import axios from 'axios';

const API = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
});


export function login(identifiant, password) {
    console.log(process.env.VUE_APP_API_URL)
    return API.post('/login', { 'identifiant': identifiant, 'password': password })
        .then(res => {
            localStorage.setItem('token', res.data.access_token);
            console.log("setItem token ", res.data.access_token)
            return res.data;
        });
}

export function check(valeur, category) {
    console.log("check")
    return API.get('/check/' + valeur + '/' + category);
}

export function getProfile() {
    console.log("getProfile")
    return API.get('/profile');
}

export function signInUser(id, mdp) {
    console.log("signIn")
    return API.post('/signIn', {"identifiant": id, "password": mdp});
}

export function searchMusic(searchStr) {
    console.log("searchMusic")
    return API.get('/searchMusic/' + searchStr);
}

API.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});