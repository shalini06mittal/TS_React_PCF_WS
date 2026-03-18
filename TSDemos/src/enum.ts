enum Direction{
    NORTH ="north", SOUTH ="south", EAST ="east", WEST="west"
}

let destination:Direction = Direction.EAST;

console.log(Direction.NORTH);
// console.log(Direction["east"]);

console.log(destination);
enum Priority{
    LOW=1, MED=5, HIGH=10
}
console.log(Priority.HIGH);
console.log(Priority[1]);

