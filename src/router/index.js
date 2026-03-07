import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import PetitBac from '../views/PetitBac.vue'
import LoginView from '../views/Login.vue'
import SignUp from '../views/SignUp.vue'
import SignIn from '../views/SignIn.vue'

const routes = [
    { 
        path: '/login', 
        component: LoginView, 
        name: 'Login'
    },
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/petitBac',
        name: 'petitBacRedirect',
        component: PetitBac
    },
    { 
        path: '/signin', 
        component: SignIn, 
        name: 'SignIn',
    },
    { 
        path: '/signup', 
        component: SignUp, 
        name: 'SignUp',
    }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
