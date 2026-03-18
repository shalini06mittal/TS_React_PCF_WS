interface Box<T>{
    value: T;
    label: string;
}

let b1 : Box<string> = {value : "Open it up", label:"Surprise"}
let b2 : Box<number> = {value : 23, label:"Answer"}