// Service worker pour intercepter et rediriger les requêtes API
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// Intercepter les requêtes fetch
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Rediriger les requêtes vers http://localhost:5001/api vers /api
  if (url.hostname === 'localhost' && url.port === '5001' && url.pathname.startsWith('/api')) {
    // Créer une nouvelle URL avec le même chemin mais sur l'origine actuelle
    const newUrl = new URL(url.pathname, self.location.origin);
    
    // Créer une nouvelle requête avec la nouvelle URL
    const newRequest = new Request(newUrl, {
      method: event.request.method,
      headers: event.request.headers,
      body: event.request.body,
      mode: 'cors',
      credentials: 'include',
      redirect: event.request.redirect
    });
    
    // Remplacer la requête originale par la nouvelle
    event.respondWith(fetch(newRequest));
  }
});
