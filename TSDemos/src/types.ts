type age = number;
type callback = (n:number) => void;
type status = "active" | "inactive" | "pending";

type NameAndAge = {name:string} & {age:number};

function check(state: status, fn : callback): callback{

    console.log(state);
    let x = 10;
    return (x) => console.log();

}
let res = check("active", (n)=> console.log(n**2));
console.log(res(12) );

const user:NameAndAge = {name:'', age:1}