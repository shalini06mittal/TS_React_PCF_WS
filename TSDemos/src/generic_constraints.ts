

function get<T extends {length: number}>(value: T): number{

    return value.length;
}
console.log(get("hello"));
console.log(get([1,2,3,4,5]));

console.log(get({length: 10}));

// console.log(get(10));

interface Identifiable { id: number, name:string};

function findById<T extends Identifiable>(items: T[], id:number):T | undefined{
    return items.find(item => item.id === id);
}

interface User extends Identifiable{
     email?:string;
}
const users:User[] = [
    {id:1, name:"Shalini", email:"sh@f.comx"},
    {id:2, name:"Mahesh", email:"mah@f.comx"},
    {id:3, name:"Jyoti"}
];

let user = findById(users, 10);
console.log(user?.name);
console.log(user?.email);



