class Shape{
    area(): number{
        return 0;
    }
    toString(): string{
        return `Shape with area ${this.area().toFixed(2)}`
    }
}

class Circle extends Shape{
    constructor(public radius:number){
        super();
    }
    area(): number {
        return Math.PI *this.radius*this.radius;
    }
}

class Triangle extends Shape{
    constructor(public base:number , public height : number){
        super();
    }
    area(): number {
        return 0.5 * this.base * this.height;
    }
    toString(): string {
        return super.toString() + ` [${this.base} x ${this.height}]`
    }
}

let t1 = new Triangle(3,4)
console.log(t1.toString());


class A{
    // constructor(){
    //     console.log('hey A');
    // }
}
class B extends A{
    // constructor(){
    //     super();
    //     console.log('hey B');
        
    // }
}
class C extends B{
    constructor(){
        super();
        console.log('hey C');
    }
}

let b1 = new B();
console.log();
let c1 = new C();