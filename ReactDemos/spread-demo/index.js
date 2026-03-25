// const scores = [1,2,3,4,5]
// scores.push(10);
// // console.log(scores);
// let s1 = [...scores, 12,13,14]; // doing a shalow copy of the elements - pointing to the same refrence scores
// //s1.push(50)
// // console.log(scores);// 1 2 3 4 5 10 50
// console.log(s1);// 1 2 3 4 5 10 50

// //s1.splice(0, 2)
// let newScores = s1.filter(score => score %2 == 0);
// console.log(s1);
// console.log(newScores);clearInterval

// let freshScores = [70,80,90,2];

// let totalScores = [...newScores, ...freshScores]
// console.log(totalScores);
// // totalScores[1].push(100)
// console.log(freshScores);
// console.log(totalScores);



const employee = {name:'Shalini', city:'Mumbai'}
// console.log(employee);
// const obj = {...employee, country:'India', name:'Mahesh'};
const obj = {country:'India', name:'Mahesh',...employee};
// obj.country = 'India';
// console.log(employee);
// console.log(obj);
// let emp1 = {city:'Pune', email:'abc@gmai.com'}
// let emp2 = {...employee, ...emp1}
// console.log(emp2);

const customers = [
    {name:'Shalini', city:'Mumbai', phone:'1212121212', id:1},
    {name:'Mahesh', city:'Pune', phone:'6767676767', id:2},
    {name:'Meysam', city:'Delhi', phone:'2323232323', id:3},
    {name:'Shruti', city:'Indore', phone:'3434343434', id:4},
    {name:'Ganesh', city:'MumPatnabai', phone:'9012121234', id:5},
];


/**
 * 1. find a customer with id 1
 * 2. update the phone number to 6789765432
 * 3. without changing the original customers array. Should get a new customers array with changed phone number for id 1
 */
// console.log(customers.map(customer => customer.id === 1 ? {...customer, phone:'6789765432'}: customer));

// console.log(customers.map(customer => { 
//     return {...customer ,name:customer.name.toUpperCase()}
// }));

// console.log(customers.map(customer =>  {...customer ,name:customer.name.toUpperCase()}));
// console.log([...customers,  {name:'abc', city:'abc', phone:'889769887696', id:6}]);

// console.log([...customers,  {name:'Ganesh', city:'MumPatnabai', phone:'9012121234', id:5}]);

// console.log(customers);

//computed property

let prod = {pname:'Laptop', price:78900};

let {key, data} = {key:'price', data:'56757575' }


let newprod = {...prod, [key]:data};
console.log(newprod);
console.log(prod);





