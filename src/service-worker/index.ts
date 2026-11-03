import { self } from '$app/service-worker';
import { version } from '$app/env';
import { immutable, assets, prerendered } from '$app/manifest';
const PREFIX = 'roam-planner-cache-';
const CACHE = `${PREFIX}${version}`;
const scoped = (path: string) =>
  new URL(path.replace(/^\/+/, ''), self.registration.scope).href;
const files = [...immutable, ...assets].map(({ path }) => scoped(path));
const pages = prerendered.map(({ path }) => scoped(path.replace(/\/?$/, '/')));
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll([...new Set([...files, ...pages])]))
  );
});
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      for (const key of await caches.keys())
        if (key.startsWith(PREFIX) && key !== CACHE) await caches.delete(key);
      await self.clients.claim();
    })()
  );
});
self.addEventListener('fetch', (event) => {
  if (
    event.request.method !== 'GET' ||
    !event.request.url.startsWith(self.registration.scope)
  )
    return;
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE);
      const url = new URL(event.request.url);
      const cached = await cache.match(url.origin + url.pathname);
      if (event.request.mode !== 'navigate' && cached) return cached;
      try {
        return await fetch(event.request);
      } catch {
        if (cached) return cached;
        const fallback = await cache.match(scoped('404.html'));
        if (event.request.mode === 'navigate' && fallback)
          return new Response(await fallback.text(), {
            status: 404,
            headers: { 'Content-Type': 'text/html; charset=utf-8' }
          });
        return Response.error();
      }
    })()
  );
});
