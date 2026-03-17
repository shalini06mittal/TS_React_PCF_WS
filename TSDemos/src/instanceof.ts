class Dog {
  name: string;
  constructor(name: string) { this.name = name; }
  bark()  { return `${this.name} says: Woof!`; }
}
class Cat {
  name: string;
  constructor(name: string) { this.name = name; }
  purr()  { return `${this.name} says: Purrr...`; }
}
type Animal = Dog | Cat;

function makeSound(animal: Animal): string {
  if (animal instanceof Dog) {
    // ✅ TypeScript knows: animal is Dog here
    return animal.bark();
  }
  // ✅ TypeScript knows: animal must be Cat here
  return animal.purr();
}

console.log(makeSound(new Dog("Rex")));  // Rex says: Woof!
console.log(makeSound(new Cat("Mimi"))); // Mimi says: Purrr...


