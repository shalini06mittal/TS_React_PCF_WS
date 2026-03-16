function add(a:number,b?:number):number{
    if(b)
        return a+b;
    return a+100;
}

// console.log(add(2));
// console.log(add(2, 0));
// console.log(add(2, undefined));
// console.log(add(2, NaN));
// positional arguments
function add1(a:number, c:number | undefined,b:number = 0, d=9878989, name=""):number{
        return a+b;   
}

// function add1(a:number, b:number = 0,c:number, d=9878989, name=""):number{
//         return a+b;   
// }
// console.log(add1(2,1,2));
// console.log(add1(2, 3));
// console.log(add1(2, undefined));
// console.log(add1(2, NaN));

// arrow functions?

// named
function square(n:number){
    return n*n;
}
let sq = square;
console.log(sq(3));
// function expression
let cube = function(n:number):number{return n**3}
console.log(cube);
console.log(cube(3));

function calculate(nos:number[], fn:Function):void{
    for (const element of nos) {
        console.log(fn(element));
    }
}
calculate([1,2,3,4,5], square)
calculate([1,2,3,4,5], Math.sqrt)
calculate([1,2,3,4,5], function(val:number):number{ return val + val*0.1})
console.log();

// (parameters) => body
calculate([1,2,3,4,5], (val:number):number => { 
    console.log("Value", val);
    return val + val*0.4
})
console.log();

calculate([1,2,3,4,5], (val:number):number => val + val*0.7)

// 1+ 10% of 1
/**
 * 3 important parts in a functions :
 * 1. takes input
 * 2. processes input
 * 3. returns value : output
 */





