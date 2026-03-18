export class Employee{
    constructor(public id:number, 
        public name:string){}

    display():string{
        return `Id: ${this.id} : Name : ${this.name}`;
    }
}

// export { Employee};