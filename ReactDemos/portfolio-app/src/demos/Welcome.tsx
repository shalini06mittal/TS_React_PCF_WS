
type CustomerProps = {
    name:string
    age:number
    email:string
}

// destructing syntax
// function Welcome(props:CustomerProps){
function Welcome({name, age, email}:CustomerProps){
    const colors:string[] = ["red", "blue","purple","yellow"]
    // console.log(props);
    
    return (
        <>
            <h3>Hola, Welcome {name}!!!</h3>
            <p>You are {age} years old</p>
            <p>Email: {email}</p>
            <p>Colors: {colors}</p>
            {
                colors.map(color => <p key={color} style={{color: color, backgroundColor:'black'}}>{color}</p>)
            }
        </>
    )
}

export default Welcome;