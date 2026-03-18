interface Box<T>{
    value: T;
    label: string;
}

let b1 : Box<string> = {value : "Open it up", label:"Surprise"};
let b2 : Box<number> = {value : 23, label:"Answer"};

// Write a generic function `zip<A, B>(arr1: A[], arr2: B[]): [A, B][]`
//  that combines two arrays into an array of pairs. For example: `zip([1,2,3], 
// ["a","b","c"])` → `[[1,"a"],[2,"b"],[3,"c"]]`. Handle different lengths by stopping at the shorter array.

function zip<A,B>(arr1:A[], arr2:B[]):[A,B][]{
    let l1 = arr1.length, l2= arr2.length;
    let minLength = Math.min(l1, l2);
    let combinedArray:[A,B][] = [];
    for(let i=0 ; i<minLength ;i++){
        combinedArray.push([arr1[i]!,arr2[i]!]);
    }
    return combinedArray;
}