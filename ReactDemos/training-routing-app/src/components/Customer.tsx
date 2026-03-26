import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

type UserParams ={
    id:string
}

interface CustomerProps{
    id:number;
    name:string
}
const customers:CustomerProps[] = [
    {id:1, name:'A'},
    {id:2, name:'B'},
    {id:3, name:'C'},
]
export default function Customer() {

    const [cust, setCust] = useState<CustomerProps | undefined>({id:0, name:''});
    const param = useParams<UserParams>();
    useEffect(()=>{
        
        let id:number = parseInt(param.id!);
        const c1:CustomerProps|undefined = customers.find(c => c.id === id);
        setCust(c1);
        
    },[cust])
    
  return (
    <div>
        <p>{ cust ?(cust.name) : `No customer found` }</p>
    </div>
  )
}
