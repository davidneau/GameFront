import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import PetitBac from '../views/PetitBac.vue'
import LoginView from '../views/Login.vue'
import SignUp from '../views/SignUp.vue'
import SignIn from '../views/SignIn.vue'
import GameLayout from '../views/games/GameLayout.vue'
import GameOverview from '../views/games/GameOverview.vue'
import GameRules from '../views/games/GameRules.vue'
import GameComments from '../views/games/GameComments.vue'
import GameLeaderboard from '../views/games/GameLeaderBoard.vue'

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
        path: '/jeux/:game',
        component: GameLayout,
        children: [
        {
            path: '',
            name: 'game-overview',
            component: GameOverview
        },
        {
            path: 'regles',
            name: 'game-rules',
            component: GameRules
        },
        {
            path: 'commentaires',
            name: 'game-comments',
            component: GameComments
        },
        {
            path: 'classement',
            name: 'game-leaderboard',
            component: GameLeaderboard
        }
        ]
    },
    {
        path: '/jeux/petitBac/play',
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
  history: createWebHashHistory(),
  routes
})

export default router
