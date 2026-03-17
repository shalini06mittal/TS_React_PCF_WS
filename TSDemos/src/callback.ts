// function login(email:string, callback:Function){
//     setTimeout(() => {
//         console.log("Response received");
//         if(email === 'sh@a.com'){
//             callback({email, status:'success'})
//         }
//         else callback({email, status:'failure'})
//     }, 3000);
// }

// function getUserVideos(email:string, callback:Function){
//     // will return the ids  of all the videos watch by user email
//     setTimeout(() => {
//         callback(["M1", "M2", "M3"])
//     }, 2000);
// }

// function getVideoDetails(videoid:string, callback:Function){
//     // will return the ids  of all the videos watch by user email
//     setTimeout(() => {
//         callback(`Title : for video ${videoid}`)
//     }, 2000);
// }
// // callback hell
// login('sh@a.com', (resp:any)=> {
//         console.log(resp)
//         if(resp.status === 'success'){
//             getUserVideos(resp.email, (videos:any)=>{
//                 getVideoDetails(videos[0], (details:string)=>{
//                     console.log(details);
//                 })
//             })
//         }
//     }
// );
// // Promises => pending, fulfillled(resolved), rejected(failure)

function login(email:string):Promise<any>{
    return new Promise((resolve: any, reject: any)=>{

            setTimeout(() => {
                console.log("Response received");
                if(email === 'sh@a.com'){
                    resolve({email, status:'success'})
                }
                reject({email, status:'failure'})
            }, 3000);

    })
}

function getUserVideos(email:string):Promise<string[]>{
    // will return the ids  of all the videos watch by user email

    return new Promise((resolve, reject)=>{
        setTimeout(() => {
            resolve(["M1", "M2", "M3"])
         }, 2000);
    })
    
}

function getVideoDetails(videoid:string){
    // will return the ids  of all the videos watch by user email
     return new Promise((resolve, reject)=>{
            setTimeout(() => {
                resolve(`Title : for video ${videoid}`)
            }, 2000);
        })
}
// callback hell
// login('sh@a.com')
// .then(resp => {
//     console.log(resp);
//     getUserVideos(resp.email)
//     .then(videos => 
//         getVideoDetails(videos[1])
//         .then(data => console.log(data)))
//     }
// ).catch(err => console.log(err));
console.log("1-------");

// login('sh@a.com')
// .then(resp => {
//     console.log("login success");
//      return getUserVideos(resp.email)
//     })
// .then(videos => getVideoDetails(videos[2]))
// .then(data => console.log(data))
// .catch(err => console.log(err));

// login('sh@a.com')
// .then(resp => getUserVideos(resp.email)) // array of video id
// .then(videos => Promise.all(videos.map(v => getVideoDetails(v))))
// .then(data => data.forEach( d=> console.log(d)))
// .catch(err => console.log(`error ${JSON.stringify(err)}`));

// console.log("DONE");


// Promises => pending, fulfillled(resolved), rejected(failure)



async function processUser(){
    const resp = await login('sh@a.com');

    console.log(resp);

    const videos = await getUserVideos(resp.email);

    console.log(videos);

    const details = await Promise.all(videos.map(v => getVideoDetails(v)));

    console.log(details);
    

}

processUser();

