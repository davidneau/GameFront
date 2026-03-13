import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

createApp(App).use(router).mount('#app')

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('../public/service-worker.js')
      .then((registration) => {
        console.log('Service Worker enregistré :', registration)
      })
      .catch((error) => {
        console.error('Erreur Service Worker :', error)
      })
  })
}