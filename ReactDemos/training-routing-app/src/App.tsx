import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import NavBar from './pages/NavBar'
import About from './components/About'
import Contact from './components/Contact'
import Service from './components/Service'
import {Route, Routes} from 'react-router-dom';
import Home from './components/Home'
import Customer from './components/Customer'
// import './App.css'

function App() {
  
  const [showContact, setshowContact] = useState<boolean>(false);
//React.MouseEvent<HTMLAnchorElement>
  const contactPage = (e:any)=>{
    e.preventDefault();
    setshowContact(!showContact)
    alert('contact page')
  }
  return (
    <>
     <h1>Welcome to routing!!</h1>
     <NavBar contactPage={contactPage}/>
     <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/contact' element={<Contact/>}></Route>
        <Route path='/about' element={<About/>}></Route>
        <Route path='/service' element={<Service/>}></Route>
        <Route path='/customer/:id' element={<Customer/>}></Route>
     </Routes>
     {/* <About/>
     {showContact && <Contact/>}
     <Service/> */}
    </>
  )
}

export default App
