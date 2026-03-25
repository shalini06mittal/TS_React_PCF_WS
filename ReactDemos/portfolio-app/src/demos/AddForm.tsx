import React, { useState } from 'react'

interface CustomerProps{
    name: string;
    password:string;
    gender:string;
    skills:string[]
}

export default function AddForm() {

    // const submit = (event:React.FormEvent<HTMLFormElement>)=>{
    //         event.preventDefault();
    //         let formData = new FormData( event.currentTarget);
            
    //         console.log(formData.get('username'));
            
    // }

    // const submit = ()=>{
    //     let ele = document.getElementById?.('username')  ;
    //     if(ele)
    //         console.log((ele as HTMLInputElement).value);
            
    // }

//   const [username, setUsername] = useState<string>('Guest');
//   const [password, setpassword] = useState<string>('');
//   const [gender, setGender] = useState<string>('Male');

    const [form, setform] = useState<CustomerProps>({name:'', password:'', gender:'male', skills : ['Java']})

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
        const { name , value, type} = e.target;
        console.log(`name : ${name}, value : ${value}, type : ${type}`);
        
        //setform(prev => ({...prev, }))
        
    }
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
        const { name , value, type} = e.target;
        console.log(`name : ${name}, value : ${value}, type : ${type}`);
    }

     const handleGenderChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
        const { name , value, type} = e.target;
        console.log(`name : ${name}, value : ${value}, type : ${type}`);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
        const { name , value, type, checked} = e.target;
        console.log(`name : ${name}, value : ${value}, type : ${type}`);
        
            // if(name=== 'name')
            //     setform(prev => ({...prev , name:value}));
                
            // if(name ==='password')
            //     setform(prev => ({...prev , password:value}));
                
            // if(name === 'gender')
            //     setform(prev => ({...prev , gender:value}));

            if(type==='checkbox'){
                setform(prev =>(
                    {
                        ...prev, // {name:'', password:'', gender:'male', skills : ['Java']}
                        // java , react
                        [name]: checked ? [...prev.skills , value ] : prev.skills.filter(skill => skill !== value)
                    }
                ))
            }
            else
            setform(prev => ({...prev , [name]: value}))
    }
  return (
    <div>
        {/* <form onSubmit={submit}>
            <input type="text" name="username" id="" />
            <input type="submit" value='Submit'/>
        </form> */}
        <label htmlFor="username">Username</label>
        <input type="text" name='name'
            value={form.name}
            //  onChange={handleNameChange}
            onChange={handleChange}
            id="username" />

        
         <label htmlFor="password">password : </label>
        <input type="password" name='password'
            value={form.password} 
            // onChange={handlePasswordChange}
            onChange={handleChange}
            id="password" />

         
        Female: <input type="radio" name='gender'
            value='female' 
            // onChange={handleGenderChange}
            onChange={handleChange}
            checked = {form.gender=== 'female'}
            id="gender" />

        Male: <input type="radio" name='gender'
            value='male' 
            // onChange={handleGenderChange}
            onChange={handleChange}
             checked = {form.gender=== 'male'}
            id="gender" />

            {/* CHECKBOX */}
            <label>
                <input
                type="checkbox"
                name="skills"
                value="Java"
                checked={form.skills.includes('Java')}
                onChange={handleChange}
                />
                Java
            </label>

            <label>
                <input
                type="checkbox"
                name="skills"
                value="React"
                checked={form.skills.includes('React')}
                onChange={handleChange}
                />
                React
            </label>
        
        {/* <button onClick={submit}>Submit</button> */}
        
    </div>
  )
}
