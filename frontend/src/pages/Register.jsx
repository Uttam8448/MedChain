import React from 'react'
import DoctorImage from '../images/d7.png'
import PatientImage from  "../images/p1.png"
import { useState } from 'react'

import SignUpForm from '../components/core/RegisterPage/SignUpForm'

const Register = () => {
  const [clientType,setClientType] = useState(1);
  return (
      <div className='Orbitron flex justify-center mx-auto mt-6 tracking-widest  border-[1px] box-border bg-neutral-900 p-2 rounded-md' >
        <SignUpForm clientType={clientType} setClientType={setClientType}/>
        <div className=' w-[200px] flex items-end mb-10'>
        {
          clientType === 2 && (
            <img src={DoctorImage} alt="DoctorImage" width="170px"/>
          )
        }
        {
          clientType=== 1 && (
            <img src={PatientImage} alt="PatientImage" width="200px"/>
          )
        }
        </div>
      </div>
  )
}

export default Register;