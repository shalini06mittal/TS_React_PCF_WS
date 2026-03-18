// // selection sort
// function sort(arr:number[]):number[]{
//     const n = arr.length;
//     for(let i=0;i<n;i++){
//         let index = i;
//         for(let j=i+1; j<n;j++){
//             if(arr[j]! < arr[index]!)
//                 index = j
//         }
//         let t = arr[i];
//         arr[i] = arr[index];
//         arr[index] = t;
//     }
//     return arr;
// }
// console.log(sort([2,1,7,9,4,6]));


function sort<T=string>(arr:T[]):T[]{
    const n = arr.length;
    for(let i=0;i<n;i++){
        let index = i;
        for(let j=i+1; j<n;j++){
            if(arr[j]! < arr[index]!)
                index = j
        }
        let t:T = arr[i]!;
        arr[i] = arr[index]!;
        arr[index] = t!;
    }
    return arr;
}


console.log(sort([2,1,7,9,4,6]));
console.log(sort(["apples","oranges","banana","strawberries","berries"]));

function pair<T>(a:T,b:T):T[]{
    return [a, b];
}
const pairs = <T> (a:T,b:T):T[] => [a,b];