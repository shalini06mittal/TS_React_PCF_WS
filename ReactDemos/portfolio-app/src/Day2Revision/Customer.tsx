import React from 'react'

export interface CustomerProps{
  id:number
  name:string
  city:string
}
export interface Closeable{
  close: (id:number) => void
}
// export default function Customer(
//   props:CustomerProps) {

export default function Customer(
  {name, city, id, close}: (CustomerProps & Closeable)) {
   
  // const name:string = "Shalini";
  // const city:string = "Mumbai";
  
  const welcome = ()=>{
    console.log('hello '+name);
    alert('Loading Profile '+name)
  }

  return (
    <div style={{color:'white', 
        backgroundColor:'black',
        padding:'10px',
        width:'40%',
        marginBottom:'5px'}}>
        <p>Customer Name: {name}</p>
        <p>Customer City: {city}</p>
        <button onClick={welcome}>Profile</button>
        <button onClick={()=>close(id)}>Close Profile</button>
    </div>
  )
}
