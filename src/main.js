import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './registerServiceWorker'

createApp(App).use(router).mount('#app')

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(reg => console.log('Service Worker enregistré :', reg))
      .catch(err => console.error('Erreur Service Worker :', err))
  })
}