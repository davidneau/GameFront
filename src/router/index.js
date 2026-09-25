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
import Snake from '@/views/Snake.vue'
import Runner from '@/views/Runner.vue'
import JDR from '@/views/JDR.vue'
import player_JDR from '@/views/player_JDR.vue'
import MJ from '@/views/MJ.vue'
import Tiktok from '@/views/Tiktok.vue'

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
        path: '/jeux/snake/play',
        name: 'snakeRedirect',
        component: Snake
    },
    {
        path: '/jeux/runner/play',
        name: 'runnerRedirect',
        component: Runner
    },
    {
        path: '/jeux/jdr/play',
        name: 'jdrRedirect',
        component: JDR
    },
    {
        path: '/jeux/jdr/player',
        name: 'jdr_player',
        component: player_JDR
    },
    {
        path: '/jeux/jdr/mj',
        name: 'jdr_mj',
        component: MJ
    },
    {
        path: '/tiktok/',
        name: 'tiktokRedirect',
        component: Tiktok
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
