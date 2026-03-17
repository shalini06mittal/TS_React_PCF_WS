interface Cat{ 
    kind : "cat";
    purr(): void;
}
interface Dog{ 
    kind : "dog";
    bark(): void;
}

type Pet = Cat | Dog;

function isCat(pet: Pet) : pet is Cat{
    return pet.kind === "cat";
}

function isDog(pet: Pet) : pet is Dog{
    // return (pet as Dog).bark !== undefined;
    return "bark" in pet;
}
const myDog: Dog = {
    kind: "dog",
    bark: function (): void {
        console.log("Barked");
        
    }
}