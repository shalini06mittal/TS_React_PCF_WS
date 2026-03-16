let arr:number[] = [1,2,3,4,5,5,6,7,7];

let primes: readonly number[] = [1,3,5,7,9];
// primes[0] = 10;

arr[0] =100;

let point :[number, number] = [1,3];

let coord : [x:number, y:number] = [4,7];

let [a,b] = point; // destructuring
console.log(a, b);

let data : [string , ...number[]] = ["ads",23,4,3,5,35,5,35]

console.log(coord[0]);



