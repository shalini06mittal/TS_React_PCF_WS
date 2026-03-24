import { useState } from "react";

export default function Counter() {
    
    // value of counte changes -> 
    // the current state should reflect on UI
    //let count = 0;

    const [count, setCount] = useState<number>(200);


    const increment = ()=>{
        //count += 1
        setCount(count+1)
        console.log('Count ',count);   
    }

    return (
    <div>
        <h1>Counter Demo - useState</h1>
        <p>Count : {count}</p>
        <button onClick={increment}>Increment</button>
    </div>
  )
}
