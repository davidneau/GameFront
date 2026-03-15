/* eslint-disable no-console */

import { register } from 'register-service-worker'

let refreshing = false

if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready() {
      console.log('App is being served from cache by a service worker.')
    },

    registered() {
      console.log('Service worker has been registered.')
    },

    cached() {
      console.log('Content has been cached for offline use.')
    },

    updatefound() {
      console.log('New content is downloading.')
    },

    updated(registration) {
      console.log('New content is available.')

      if (registration && registration.waiting) {
        // Demande au SW en attente de s'activer tout de suite
        registration.waiting.postMessage({ type: 'SKIP_WAITING' })
      }
    },

    offline() {
      console.log('No internet connection found. App is running in offline mode.')
    },

    error(error) {
      console.error('Error during service worker registration:', error)
    }
  })

  // Quand le nouveau SW prend le contrôle, on recharge UNE SEULE FOIS
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) return
    refreshing = true
    window.location.reload()
  })
}