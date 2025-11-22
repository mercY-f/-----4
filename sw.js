// Service Worker для кеширования ресурсов
const CACHE_NAME = 'sushi-master-v6';
const urlsToCache = [
    '/',
    '/index.html',
    '/products.html',
    '/cart.html',
    '/checkout.html',
    '/coming-soon.html',
    '/contacts.html',
    '/team.html',
    '/css/style.css',
    '/js/app.js',
    '/js/products.js',
    '/js/cart.js',
    '/js/checkout.js',
    '/js/contacts.js',
    '/js/team.js',
    '/js/coming-soon.js',
    // Локальные изображения
    '/images/hero/slide1.jpg',
    '/images/hero/slide2.jpg',
    '/images/hero/slide3.jpg',
    '/images/products/philadelphia.jpg',
    '/images/products/california.jpg',
    '/images/products/unagi.jpg',
    '/images/products/tempura.jpg',
    '/images/products/nigiri-salmon.jpg',
    '/images/products/nigiri-eel.jpg',
    '/images/products/set-premium.jpg',
    '/images/products/set-party.jpg',
    '/images/products/miso-soup.jpg',
    '/images/products/ramen.jpg',
    '/images/products/cola.jpg',
    '/images/products/orange-juice.jpg',
    '/images/team/chef-alexey.jpg',
    '/images/team/chef-maria.jpg',
    '/images/team/chef-dmitry.jpg',
    '/images/team/manager-olga.jpg',
    '/images/reviews/avatar-maria.jpg',
    '/images/reviews/avatar-aleksey.jpg',
    '/images/reviews/avatar-olga.jpg',
    '/images/reviews/avatar-dmitry.jpg'
];

// Установка Service Worker и кеширование ресурсов
self.addEventListener('install', event => {
    console.log('Service Worker: Installing...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Service Worker: Caching files');
                return cache.addAll(urlsToCache);
            })
            .then(() => self.skipWaiting())
    );
});

// Активация Service Worker
self.addEventListener('activate', event => {
    console.log('Service Worker: Activated');
    
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        console.log('Service Worker: Clearing old cache');
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// Перехват запросов
self.addEventListener('fetch', event => {
    console.log('Service Worker: Fetching', event.request.url);
    
    // Для внешних ресурсов используем сеть без кеширования
    if (event.request.url.includes('unsplash.com') || 
        event.request.url.includes('images.unsplash.com')) {
        event.respondWith(fetch(event.request));
        return;
    }
    
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Возвращаем кешированную версию, если есть
                if (response) {
                    return response;
                }
                
                // Иначе делаем сетевой запрос
                return fetch(event.request)
                    .then(response => {
                        // Проверяем валидность ответа
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        
                        // Клонируем ответ
                        const responseToCache = response.clone();
                        
                        // Кешируем новый ресурс (только локальные)
                        if (!event.request.url.includes('unsplash.com') && 
                            !event.request.url.includes('images.unsplash.com')) {
                            caches.open(CACHE_NAME)
                                .then(cache => {
                                    cache.put(event.request, responseToCache);
                                });
                        }
                        
                        return response;
                    })
                    .catch(() => {
                        // Запасной вариант для страниц
                        if (event.request.destination === 'document') {
                            return caches.match('/index.html');
                        }
                    });
            })
    );
});