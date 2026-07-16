const CACHE_NAME = 'altagen-beef-v1';

// Recursos propios + librerías externas, para que la app abra aunque no haya señal
const APP_SHELL = [
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.0/chart.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.1/jspdf.plugin.autotable.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'
];

self.addEventListener('install', (event)=>{
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache=>{
      // cada recurso se agrega por separado: si alguno falla (ej. sin conexión), no rompe la instalación completa
      return Promise.all(APP_SHELL.map(url=>
        cache.add(url).catch(err=> console.warn('No se pudo cachear', url, err))
      ));
    })
  );
});

self.addEventListener('activate', (event)=>{
  event.waitUntil(
    caches.keys().then(keys=>
      Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))
    ).then(()=> self.clients.claim())
  );
});

self.addEventListener('fetch', (event)=>{
  const url = new URL(event.request.url);

  // ---- Web Share Target: WhatsApp (u otra app) comparte un archivo con esta PWA ----
  if(event.request.method === 'POST' && url.pathname.endsWith('/index.html')){
    event.respondWith(handleShareTarget(event));
    return;
  }

  // ---- resto de pedidos: cache-first con fallback a red ----
  if(event.request.method === 'GET'){
    event.respondWith(
      caches.match(event.request).then(cached=>{
        if(cached) return cached;
        return fetch(event.request).then(resp=>{
          // guardamos copia en caché para la próxima vez que esté offline
          if(resp && resp.status===200 && (url.origin===location.origin || APP_SHELL.includes(event.request.url))){
            const clone = resp.clone();
            caches.open(CACHE_NAME).then(c=>c.put(event.request, clone));
          }
          return resp;
        }).catch(()=> cached); // si falla la red y no hay cache, no hay mucho más para hacer
      })
    );
  }
});

async function handleShareTarget(event){
  try{
    const formData = await event.request.formData();
    const file = formData.get('sharedfile');
    if(file){
      await saveSharedFile(file);
    }
  }catch(err){
    console.error('Error procesando el archivo compartido:', err);
  }
  return Response.redirect('./index.html?shared=1', 303);
}

function openShareDB(){
  return new Promise((resolve,reject)=>{
    const req = indexedDB.open('altagen-share-db', 1);
    req.onupgradeneeded = ()=> req.result.createObjectStore('shared-files');
    req.onsuccess = ()=> resolve(req.result);
    req.onerror = ()=> reject(req.error);
  });
}

async function saveSharedFile(file){
  const db = await openShareDB();
  return new Promise((resolve,reject)=>{
    const tx = db.transaction('shared-files','readwrite');
    tx.objectStore('shared-files').put(file, 'pending');
    tx.oncomplete = ()=> resolve();
    tx.onerror = ()=> reject(tx.error);
  });
}
