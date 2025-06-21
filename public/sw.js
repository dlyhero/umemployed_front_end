// public/sw.js
const CACHE_NAME = 'umemploy-cache-v1'
const OFFLINE_URL = '/offline'

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching offline page')
        return cache.add(OFFLINE_URL)
      })
  )
})

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          console.log('Showing offline page')
          return caches.match(OFFLINE_URL)
        })
    )
  }
})