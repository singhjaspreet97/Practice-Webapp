const p1 = new Promise((resolve) => {    // suppose FB api
  setTimeout(() => {
       console.log('Async operation 1...'); 
       resolve(1);
    }, 2000);
}); 

const p2 = new Promise((resolve) => {   // suppose twitter api
    setTimeout(() => {
       console.log('Async operation 2...'); 
       resolve(2);
    }, 2000);
}); 

Promise.race([p1, p2])
 .then(result => console.log(result))
 .catch(err => console.log('Error', err.message));
    