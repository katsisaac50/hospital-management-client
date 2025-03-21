const CACHE_NAME = 'hospital-cache-v1';
const OFFLINE_URL = '/offline.html';

self.addEventListener('sync', async (event) => {
  if (event.tag === 'sync-patients') {
    event.waitUntil(syncPatients());
  }
});

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/offline.html',
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  if (!navigator.onLine) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request).catch(() => caches.match(OFFLINE_URL));
      })
    );
  }
});

async function syncPatients() {
  const patients = await getAllData('patients');
  if (patients.length) {
    await fetch('/api/sync/patients', {
      method: 'POST',
      body: JSON.stringify({ patients }),
      headers: { 'Content-Type': 'application/json' },
    });
    patients.forEach(patient => removeData('patients', patient.id));
  }
}


