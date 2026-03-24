import { useEffect, useState } from "react"

export default function Timer() {

  const [tick, setTick] = useState<number>(0);
// mount
// empty array is called only the first time component mounts
/**
 * In dev mode, react intentionally runs effects twice to detect any side effects
 * useEffect runs -> intervalis created
 * React unmount -> cleanupo
 * react runs the effect again
 */
  useEffect(()=>{
        let x = 1;
        const id = setInterval(() => {
          setTick(prev => prev+1);
         // console.log('interval running ', x++);
          
      }, 1000);

      // component unmounts => clear the interval
      return () => {
        console.log('cleaning');
        
        clearInterval(id)
      }

     //console.log(id);
  },[])
 
  // for every update in the tick state
  // useEffect(()=>{
  //      console.log('tick',tick);

  // },[tick]); // dependency array to call useEffect, state or props change
  
  return (
    <div>
        Tick : {tick}
    </div>
  )
}
