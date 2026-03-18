class Stack<T>{
    private items:T[] = [];
    push(item:T): void{
        this.items.push(item);
    }
    pop():T | undefined{
        return this.items.pop();
    }

    peek(): T | undefined{
        return this.items[this.items.length-1];
    }
    get size(): number{
        return this.items.length;
    }
    get isEmpty(): boolean{
        return this.items.length === 0;
    }
}

const numStack = new Stack<number>();
console.log(numStack.isEmpty);
numStack.push(1);
console.log(numStack.isEmpty);
numStack.push(10);
numStack.push(12);
console.log(numStack.size);
console.log(numStack.peek());

