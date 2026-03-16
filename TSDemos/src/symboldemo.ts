// Symbol: primitive data types => 2015 -> unique and immutable identifier

// UUID 

let s1:symbol = Symbol("id")
let s2:symbol = Symbol("id")

console.log(s1===s2);
let id = Symbol("id");

let user = {"name":"Shalini", [id] :"101", "id1":10};

for(let obj in user) console.log(obj);

console.log(user.name);
console.log(user['name']);

// console.log(user.id);
console.log(user["id1"]+10);
console.log(user[id]);
// console.log(user[id]+10);

console.log(Object.getOwnPropertyNames(user))
console.log(Object.getOwnPropertySymbols(user))




let product = {id:1, name:'laptop',price:23847.908};

// for(let obj in product) console.log(obj);

