import { useState } from "react";

function Counter() {
//   let count = 0

const [count, setCount] = useState<number>(0)
 
//   const increment = () => {
//     // count = count + 1
//     setCount(count+1)
//     // count changes in memory...
//     // but the screen stays at 0
//     console.log(count);
    
//   }

  const increment = () => setCount(count + 1)
const decrement = () => setCount(count - 1)
const reset     = () => setCount(0)

 
  return (
    // <div>
    //   <p>Count: {count}</p>
    //   <button onClick={increment}>
    //     Add
    //   </button>
    // </div>
        <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>Simple Counter</h2>
 
      <p style={{ fontSize: "48px", fontWeight: "bold", margin: "1rem 0" }}>
        {count}
      </p>
 
      <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
        <button onClick={decrement}>-</button>
        <button onClick={reset}>Reset</button>
        <button onClick={increment}>+</button>
      </div>
    </div>

  )
}


export default Counter;