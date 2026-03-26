import React, { useEffect, useRef, useState } from 'react'

export default function UseRefDemo() {

    const [text, settext] = useState<string>('')
    const inputRef = useRef<HTMLInputElement>(null);
    const countRef = useRef<number>(100);

    
    console.log('outside ',inputRef);
    
    useEffect(()=>{
        console.log('inside');
        
        console.log(inputRef);
    console.log(countRef);
    inputRef.current?.focus();
    countRef.current++;
    },[])
  return (

    <div>
        <h4>{countRef.current}</h4>
        <input type="text" name=""  ref={inputRef}
        placeholder='Search...' id="" />
        <div>
                <p>Your search will diplay here!! </p>
                <p>{text}</p>
        </div>
       
    </div>
  )
}
