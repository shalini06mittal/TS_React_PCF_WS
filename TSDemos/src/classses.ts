// class BanAccount{
//     owner:string;
//     balance:number;

//     constructor(owner:string, initailbal:number){
//         this.owner = owner;
//         this.balance = initailbal;
//     }

//     deposit(amount: number) : void{
//         this.balance += amount;
//     }

//     getBalance(){
//         return this.balance;
//     }
// }

class BanAccount{

    constructor(private owner:string, private _balance:number){
        if(_balance <=100) throw new Error("Balance should be > 100")
    }

    deposit(amount: number) : void{
        this._balance += amount;
    }

    get balance(): number{
        return this._balance;
    }

    set balance(amt:number){
        this._balance = amt;
    }

    static calculate(amount:number):number{
        return amount + amount *0.1;
    }
}

const b1 = new BanAccount("abc", 900);
const b2 = new BanAccount("pqr", 987);

console.log(b1.balance);

console.log(b2.balance);

b2.balance = 8879;
console.log(b2.balance);
console.log(BanAccount.calculate(1000));

// console.log(b1.owner);

