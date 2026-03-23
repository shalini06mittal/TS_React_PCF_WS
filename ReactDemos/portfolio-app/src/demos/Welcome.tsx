import Timer from "./Timer"

type CustomerProps = {
    name:string
    age:number
    email:string
    onSelect:(name:string)=> void
}

// destructing syntax
// function Welcome(props:CustomerProps){
function Welcome({name, age, email, onSelect}:CustomerProps){
    const colors:string[] = ["red", "blue","purple","yellow"]
    // console.log(props);
    
   
    return (
        <div>
            <Timer/>
            <h3>Hola, Welcome {name}!!!</h3>
            <p>You are {age} years old</p>
            <p>Email: {email}</p>
            {/* <p>Colors: {colors}</p> */}
            
            {
                colors.map(color => <span key={color} 
                    style={{color: color, margin:'10px',padding:'5px',
                        backgroundColor:'beige'}}>{color}</span>)
            }
            <div style={{marginTop:'10px'}}>
                {/* <button onClick={()=>clickHandler(name)}>Click Me</button> */}
                <button onClick={()=>onSelect(name)}>Click Me</button>
            </div>
            
        </div>
    )
}

export default Welcome;