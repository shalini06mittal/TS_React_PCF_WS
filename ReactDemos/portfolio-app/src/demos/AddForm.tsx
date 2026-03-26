import React, { useState } from 'react'

interface CustomerProps{
    name: string;
    password:string;
    gender:string;
    skills:string[]
}

type FormErrors = Partial<Record<keyof CustomerProps, string>>

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
    const [newErrors, setnewErrors] = useState<FormErrors>({})

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


    // Java, React, HTML
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
        const { name , value, type, checked} = e.target; 
        // <input type='text' value='' name='name'/>
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


    const validateField = (name : keyof CustomerProps, value : unknown): string =>{
        switch(name){
            case 'name':
                if(!String(value).trim()) return "Name is required"
                if(String(value).trim().length<2) return "Name must be atleast 2 characters long"
                return '';
            case 'password':
                if(!String(value).trim()) return "password is required"
                if(String(value).trim().length<8) return "password must be atleast 8 characters long"
                return '';
            default:
                return '';
        }
    }

    const submit = (e: React.FormEvent)=>{
            e.preventDefault();
            const newErrors : FormErrors = {};
            (Object.keys(form) as (keyof CustomerProps)[]).forEach(key=>{
                const msg = validateField(key, form[key])
                if(msg) newErrors[key]= msg;
            })
            setnewErrors(newErrors)
            if(Object.keys(newErrors).length > 0){
                console.log('Form has errors');
                return;
            }
            console.log('form submitted');
            
    }
  return (
    <div>
        {/* <form onSubmit={submit}>
            <input type="text" name="username" id="" />
            <input type="submit" value='Submit'/>
        </form> */}
         
         {/* <input type="text" name="username" id="" value={username} onChange={(e)=> setUsername(e.target.value)} /> */}
        <div>
        <label htmlFor="username">Username</label>
        <input type="text" name='name'
            value={form.name}
            //  onChange={handleNameChange}
            onChange={handleChange}
            id="username" />
            {newErrors?.name}
        </div>
        <div>
         <label htmlFor="password">password : </label>
        <input type="password" name='password'
            value={form.password} 
            // onChange={handlePasswordChange}
            onChange={handleChange}
            id="password" />
            {newErrors?.password}
</div>
<div>
         
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
</div>
<div>
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
        </div>
        <div>
             <button onClick={submit}>Submit</button>
        </div>
       
        
    </div>
  )
}
