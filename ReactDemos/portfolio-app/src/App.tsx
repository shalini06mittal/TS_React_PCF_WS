import React from "react";
import './App.css';

const styles:React.CSSProperties = {
  backgroundColor: 'blue',
  padding: '10px',
  color: 'white'
}
// JSX ` ${}`
const greet = (name:string): string => "HOLA "+name;

function App() {
  const username = "Shalini";
  
  return (
    <>
      <h1 style={{color:'red'}}>Welcome {username} </h1>
      <h1 style={{color: '#2563eb', fontSize: '24px' }}>My Portfolio</h1>
            
      <div>
        <p style={styles}>this is para</p>
      </div>
      <h4 className="decor">{greet('Mahesh')}</h4>
    </>

    
  )
}

export default App
