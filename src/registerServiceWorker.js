import { register } from 'register-service-worker'

let refreshing = false

if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}sw.js`, {
    ready() {
      console.log('✅ SW ready')
    },
    registered() {
      console.log('✅ SW registered')
    },
    cached() {
      console.log('📦 Content cached for offline use')
    },
    updatefound() {
      console.log('⬇️ New content downloading')
    },
    updated(registration) {
      console.log('⬆️ New content available')
      if (registration && registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' })
      }
    },
    offline() {
      console.log('📴 Offline mode')
    },
    error(error) {
      console.error('❌ SW registration error:', error)
    }
  })

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) return
    refreshing = true
    window.location.reload()
  })
}