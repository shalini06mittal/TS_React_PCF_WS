interface User{
    name:string,
    email:string,
    city?:string
}

function showdetails(data:User){
    console.log(data.name, data.email);
    
}

const u1:{name:string, email:string} = {name:'shalini', email:'askdj'}
showdetails({name:'shalini', email:'askdj'})
// showdetails(17)

interface Calculator{
    add(a:number, b:number) : number;
    reset(): void;
    sub(a:number, b:number) : number;
}
const calc: Calculator = {
    add: function (a: number, b: number): number {
        throw new Error("Function not implemented.");
    },
    reset: function (): void {
        throw new Error("Function not implemented.");
    },
    sub: function (a: number, b: number): number {
        throw new Error("Function not implemented.");
    }
}

class Math implements Calculator{
    add(a: number, b: number): number {
        throw new Error("Method not implemented.");
    }
    reset(): void {
        throw new Error("Method not implemented.");
    }
    sub(a: number, b: number): number {
        throw new Error("Method not implemented.");
    }
    
}
// Call Signature of interfaces

interface StringTransform{
    (input:string) : string;
}

const upper: StringTransform = (str:string) => str.toUpperCase();
console.log(upper("shalini"));

const reverse: StringTransform = (str:string) => str.split('').reverse().join('');
console.log(reverse("shalini"));


interface Counter {
    (start:number) : string;
    count:number;
    reset?():void
}

const counter = ((start:number) =>{
    counter.count++;
    return 'Count  '+ start
}) as Counter;

counter.count = 0;

console.log(counter(5));

console.log(counter.count);


