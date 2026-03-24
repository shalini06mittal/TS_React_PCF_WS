import React from "react";
// import './App.css';
import Welcome from "./demos/Welcome";
import Customer, { type CustomerProps } from "./Day2Revision/Customer";
import Counter from "./demos/Counter";

const styles:React.CSSProperties = {
  backgroundColor: 'blue',
  padding: '10px',
  color: 'white'
}
// JSX ` ${}`
const greet = (name:string): string => "HOLA "+name;

const customers:CustomerProps[] =[
  {id:1, name:'Shalini', city:'Mum'},
  {id:2, name:'Meysam', city:'Delhi'},
  {id:3, name:'Mahesh', city:'Pune'},
  {id:4, name:'Ganesh', city:'Chennai'},
];

function App() {
  
    const username = "Shalini";
    const clickHandler = (pname:string):void=>{
        alert('Clicked for '+pname);
    }

    const removeProfile = (id:number)=>{
      alert('Removing customer '+id);
      // removing the customer from array
      //loop
    }
  return (
    <div style={{margin:'10px'}}>

      <Counter/>

      {/* {
        customers.map(customer => 
           <Customer  id={customer.id} name={customer.name}
            close = {removeProfile}
            city={customer.city}/>)
      }
       */}

      {/* <Customer name="Shalini"  city="Mumbai"/> */}
       {/* <Customer name="Mahesh" city="Pune"/> */}
       {/* <Customer name="Shirsha" city="Pune"/> */}
       {/* <Customer name="Ketan" city="Delhi"/> */}

      {/* <Welcome name="Shalini" age={23}
       email="sh@g.com"
       onSelect={clickHandler}
       />

      <Welcome name="Mahesh" age={14} 
      email="mah@g.com"
      onSelect={clickHandler}/>

      <Welcome name="Puja" age={34} 
      email="pu@g.com"
      onSelect={clickHandler}/> */}
      {/* <h1 style={{color:'red'}}>Welcome {username} </h1>
      <h1 style={{color: '#2563eb', fontSize: '24px' }}>My Portfolio</h1>
            
      <div>
        <p style={styles}>this is para</p>
      </div>
      <h4 className="decor">{greet('Mahesh')}</h4> */}
    </div>

    
  )
}

export default App
