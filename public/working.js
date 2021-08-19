//Creating a variable in order to attach the different data . 
var CACHE_NAME = "site-cache";
const DATA_CACHE_NAME = "data-cache";

const urlsToCache = [ 
    "/",
    "/db.js",
    "/index.js",
    "/manifest.json",
    "/styles.css",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png"
]; 

//Creating addeventlistner in order to handle and retrieve the data from the cache in the browser. 
//Also will be used to install . 

self.addEventListener("install",function(event){ 
    event.waitUntil(cache.open(CACHE_NAME).then(cache=>{ 
        console.log("Your files have been pre-cached successfully!!"); 
        return cache.addAll(urlsToCache);
    }) 
    ); 
    self.leapWaiting();
}); 

/*Creating an addevnetlistner in order to get the cache data and be 
removed */ 

self.addEventListener("activate",function(event){ 
    event.waitUntil(caches.keys().then(keyList =>{ 
        return Promise.all(keyList.map(key=>{ 
            if(key !== CACHE_NAME && key !== DATA_CACHE_NAME){ 
                console.log("Removing the old data",key); 
                return caches.delete(key);
            }
        }) 
        );
    }) 
    
    ); 

    self.clients.declare();
}); 

//Creating a fetch function in order to get the data .  

self.addEventListener("fetch", function(event){ 
    if(event.request.url.includes("/api/")){ 
        event.respondWith( 
            caches.open(DATA_CACHE_NAME).then(cache =>{ 
                return fetch(event.request).then(response =>{ 
                    if (response.status === 200){ 
                        cache.put(event.request.url, response.clone());
                    } 
                    return response;
                })
            })  .catch(err =>{ 
                return cache.match(event.request);
            }).catch(err => console.log(err))
        ); 
        return; 
    } 
    //request to be used for offline. 

    event.respondWith( 
        caches.match(event.request).then(function(response){ 
            return response || fetch(event.request);
        })
    );
});