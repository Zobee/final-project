import "./Navbar.css"
import { useState } from 'react'
import NavLinks from "./NavLinks"
const Navbar = () => {
  const [toggle, setToggle] = useState(false)
  return <nav className='navbar'>
    <div className='nav-left'>
    <h1 className='nav-logo'>Moonshot</h1>
      <NavLinks toggle={toggle} setToggle={setToggle} />
    </div>
    <div className='nav-right'>
      <input type='text' placeholder="bitcoin"/>
      <button>Search</button>
    </div>
    <div onClick={() => setToggle(prev => !prev)} className='burger'>
      CLICK
    </div>
  </nav>
}

export default Navbar