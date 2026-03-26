import React from 'react'
import { NavLink } from 'react-router-dom'

interface NavProps{
    contactPage:(e:any) => void
}
export default function NavBar({contactPage}:NavProps) {
  return (
    <div>
        <nav>
            <ul>
                <li><NavLink to='/'>Home</NavLink></li>
                <li><NavLink to='/about'>About</NavLink></li>
                <li><NavLink to='/contact'> Contact</NavLink></li>
                <li><NavLink to='/service'>Service</NavLink></li>
                <li><NavLink to='/customer'>customer</NavLink></li>
            </ul>
        </nav>
    </div>
  )
}
