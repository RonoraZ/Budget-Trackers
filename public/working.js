//Creating a variable in order to attach the different data . 

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
    event.delayUntil(caches.open(CACHE_NAME).then(cache=>{ 
        console.log("Your files have been pre-cached successfully!!");
    }) 
    ); 
    self.leapWaiting();
}); 

/*Creating an addevnetlistner in order to get the cache data and be 
removed */ 

self.addEventListener("activate",function(event){ 
    event.delayUntil(caches.keys().then(keyList =>{ 
        return Promise.all(keyList.map(key=>{ 
            if(key !== CACHE_NAME && key !== DATA_CACHE_NAME){ 
                console.log("Removing the old data",key); 
                return caches.delete(key);
            }
         }) 
        );
     }) 
    
    );
})