self.addEventListener('install', (event) => {
  console.log('Service Worker installé')
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  console.log('Service Worker activé')
})

self.addEventListener('fetch', (event) => {
  // Version minimale : ne fait rien de spécial pour l’instant
})