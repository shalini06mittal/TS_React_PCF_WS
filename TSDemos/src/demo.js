
function Person(name){
    this.name = name;
    console.log(this);
    
}

Person.prototype.greet = function(){
    console.log("normal function "+ this);
    
}

Person.prototype.welcome = ()=>{
    console.log("arrow function "+ this);
}

const p = new Person("Shalini");
p.greet();
p.welcome();

