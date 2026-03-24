import { useEffect, useState } from "react";

import Timer from "./demos/Timer";


function App() {
  
    
  const [show, setShow] = useState<boolean>(false);
  const [label, setlabel] = useState('Show Timer')


  const toggle = ()=>{
    setShow(!show);
    console.log(show); 
  }

  useEffect(()=>{
    console.log(show); 
    if(show) setlabel('Hide Timer')
      else setlabel('Show Timer')
  },[show]);

  return (
    <div style={{margin:'10px'}}>
      <h1>useEffect Demo - Lifecylcle of the component</h1>
       
       <button onClick={toggle}>{label}</button>
       
       { show && <Timer/>}
       </div>    
  )
}

export default App
