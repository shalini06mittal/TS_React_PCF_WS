console.log("Hello, World!");
let x = 10;
// x="hello"  ;
// console.log(x);
// data types :
let a = 10;
let b = true;
// pipe
let username = "hello";
username = null;
username = 10;
// let city:any = 10;
// city ="aslkdjas";
// city =true;
/**
 * ?. => optional chaining  ( checks if object null or undefined => only then call the property)
 * ?? => nullish coalescing
 * ! -> XXXXXX [ non null assertion]
 */
let pname = null;
// pname = "asdk";
// let len:number | undefined = pname?.length;
// console.log(pname?.length);
let message = pname || "Guest";
console.log(`Using || ${message}`);
let message1 = pname ?? "Guest"; // null or undefined
console.log(`Using ?? ${message1}`);
console.log();
// console.log(pname!.toUpperCase());
let product = { id: 1, name: 'laptop', price: 23847.908 };
console.log(product?.id);
// let user : {name? : string} | null = null;
// console.log(user?.name ?? "sads");
let state = 10;
export {};
// console.log(state.f1());
//# sourceMappingURL=hello.js.map