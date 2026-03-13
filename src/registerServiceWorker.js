/* eslint-disable no-console */

import { register } from 'register-service-worker'

if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready () {
      console.log(
        'App is being served from cache by a service worker.\n' +
        'For more details, visit https://goo.gl/AFskqB'
      )
    },
    registered () {
      console.log('Service worker has been registered.')
    },
    cached () {
      console.log('Content has been cached for offline use.')
    },
    updatefound () {
      console.log('New content is downloading.')
    },
    updated () {
      console.log('New content is available; please refresh.')
    },
    offline () {
      console.log('No internet connection found. App is running in offline mode.')
    },
    error (error) {
      console.error('Error during service worker registration:', error)
    }
  })
}

// Vérifie si le navigateur supporte les Service Workers
if ('serviceWorker' in navigator) {
  // Écoute l'événement `load` pour éviter de ralentir le chargement initial
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js') // Indique où se trouve votre fichier Service Worker
      .then(registration => {
        console.log('Service Worker enregistré avec succès :', registration);

        // Gestion des mises à jour
        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (installingWorker) {
            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  // Nouveau contenu disponible, informez l'utilisateur
                  console.log('Nouveau contenu disponible. Veuillez recharger.');
                } else {
                  // Contenu mis en cache pour une utilisation hors ligne
                  console.log('Contenu mis en cache pour une utilisation hors ligne.');
                }
              }
            };
          }
        };
      })
      .catch(error => {
        console.error('Erreur lors de l\'enregistrement du Service Worker :', error);
      });
  });
}