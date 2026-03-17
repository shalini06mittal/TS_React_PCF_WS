function process(value: any , x?:number): string {
    
    return value?.toUpperCase?.();

   // return value.toUpperCase()

    // if(typeof value === 'string')
    //     return value.toUpperCase();

    // return value?.toFixed(2);
}
console.log(process("hello"));
console.log(process(3.87897));
console.log(process(null));

interface Logger {
    log?(str:string): string;
}

 
