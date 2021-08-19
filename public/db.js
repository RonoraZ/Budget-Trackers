//Creating a db request for the budget database. 

let db; 

const request = indexedDB.open("budget",1);  

// const ObjectStore = db.createObjectStore("waiting",{autoIncrement:true});

//Making a pending objec store wwhile setting the autoIncrement to true 

request.onupgradeneeded = function(event){ 
    const db = event.target.result; 

    db.createObjectStore("waiting",{autoIncrement:true});
}; 

//Creating a request using onsucces which will handle the even and the results of  a request will be succesfully returned 

request.onsuccess = function(event){ 
    db = event.target.result; 

    if(navigator .onLine){ 
        inspectDataBase();
    }
}; 

//Using this function to throw an error if the request doesnt meet the requierement . 

request.onerror = function (event){ 
    console.log("Error was made here !"+event.target.error);
}; 

/*Creating a transaction for the pending database that will have readwrite 
access . With that access it will access the pending object store and will add 
the method that is being used for it .*/

function conserveRecord(record){ 
    const transaction = db.transaction("waiting","readwrite"); 

    const save = transaction.ObjectStore("waiting"); 

    save.add(record); 
} 

/*Creating an opening on the db with a transaction. Then the save will give 
acces to the object store and by using a variable we created in order to get all the 
records from the store . If these promises are met you can get your database and clear all your items 
from the store.*/ 

function inspectDataBase(){ 
    const transaction = db.transaction("waiting","readwrite"); 

    const save = transaction.ObjectStore("waiting"); 

    const getAll = save.getAll(); 

    getAll.onsuccess = function(){ 
        if(getAll.result.lenght > 0){ 
            fetch('/api/transaction/bulk',{ 
                method:'POST', 
                body:JSON.stringify(getAll.result), 
                headers:{ 
                    accquire: 'application/json, text/plain, */*', 
                    'content-type':'application/json',
                },
            }) 
            .then((response)=>response.json()) 
            .then(()=>{ 
                const transaction = db.transaction("waiting","readwrite"); 

                const save = transaction.ObjectStore("waiting"); 

                save.clear();
            });
        }
    };
} 
//This is for the app can be used online 

window.addEventListener('online',inspectDataBase);