import React from 'react'
import { useContext } from 'react'
import { UserContext } from '../App'
import { Link } from 'react-router-dom'
import logo from '../images/logo13.png'
import DocImage from '../images/DocCardImage.png'
import PatientImage from '../images/patient-12.png'
const Navbar = () => {
  const { token,user } = useContext(UserContext);
  return (
    <div className='w-[100%] flex justify-between bg-neutral-900 text-cyan-400 px-10 h-[70px] border-b-[1px] border-cyan-100 Orbitron sticky top-0 '>
        <Link to="/" className='flex gap-4 items-center'><img src={logo} alt="logo" width="35px"></img><span className='text-2xl tracking-widest font-bold'>MEDCHAIN</span></Link>
        <div className='flex gap-8 items-center font-medium text-cyan-100'>
            <Link to="/" className='p-2'>Home</Link>
            <Link to="/about" className='p-2'>About</Link>
            <Link to="/contact" className='p-2'>Contact</Link>
        </div>
        {
          !token && 
          ( 
          <div className='flex gap-6 items-center '>
            <Link to="/login" className='border-[1px] p-2  rounded-md border-cyan-100 background opacity-70 hover:opacity-100' >Login</Link>
            <Link to="/register" className='border-[1px] p-2 rounded-md border-cyan-100 background opacity-70 hover:opacity-100'>Register</Link>
        </div>
          )
        }
        {
          token &&
          (
            <div className='text-cyan-100 my-auto bg-neutral-800 rounded-full w-[45px] h-[45px] object-contain flex justify-center items-end  hover:bg-neutral-700 transition-all duration-300 border-[2px] border-cyan-100'>
              <Link to="/dashboard"><img src={user.accountType==="Patient"?PatientImage:DocImage} alt='img' width='40px' className='rounded-full'></img></Link>
            </div>
          )
        }
    </div>
  )
}

export default Navbar