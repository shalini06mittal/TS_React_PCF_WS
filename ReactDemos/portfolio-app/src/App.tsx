import React from "react";
// import './App.css';
import Welcome from "./demos/Welcome";

const styles:React.CSSProperties = {
  backgroundColor: 'blue',
  padding: '10px',
  color: 'white'
}
// JSX ` ${}`
const greet = (name:string): string => "HOLA "+name;

function App() {
  const username = "Shalini";
   const clickHandler = (pname:string):void=>{
        alert('Clicked for '+pname);
    }
  return (
    <>
      <Welcome name="Shalini" age={23}
       email="sh@g.com"
       onSelect={clickHandler}
       />

      <Welcome name="Mahesh" age={14} 
      email="mah@g.com"
      onSelect={clickHandler}/>

      <Welcome name="Puja" age={34} 
      email="pu@g.com"
      onSelect={clickHandler}/>
      {/* <h1 style={{color:'red'}}>Welcome {username} </h1>
      <h1 style={{color: '#2563eb', fontSize: '24px' }}>My Portfolio</h1>
            
      <div>
        <p style={styles}>this is para</p>
      </div>
      <h4 className="decor">{greet('Mahesh')}</h4> */}
    </>

    
  )
}

export default App
