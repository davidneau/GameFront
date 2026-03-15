/* eslint-disable no-undef */
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching'
import { clientsClaim } from 'workbox-core'

// Active immédiatement le nouveau SW
self.skipWaiting()

// Le nouveau SW prend le contrôle tout de suite
clientsClaim()

// Nettoie les anciens caches
cleanupOutdatedCaches()

// Pré-cache injecté automatiquement par Workbox
precacheAndRoute(self.__WB_MANIFEST)

// Sécurité supplémentaire si on envoie un message depuis registerServiceWorker
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})