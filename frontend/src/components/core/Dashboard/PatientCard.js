import React,{useState} from 'react'
import patientImage from '../../../images/patient-12.png'
import referIcon from '../../../images/referIcon.png'


const PatientCard = ({patient}) => {
  const [check,setCheckState] = React.useState(false);
  
  return (
    <>
    {!check && (<div className='flex gap-8 w-[100%] border-[1px] border-slate-400 rounded-lg bg-neutral-800 Orbitron tracking-widest'><div className='p-3 bg-neutral-800 rounded-l-lg border-r-[1px] border-neutral-400'><img src={patientImage} className='w-[150px] h-[150px] rounded-lg'></img></div>
        <div className='h-[100%] flex flex-col justify-evenly tracking-widest'>
            <p>Name : {patient.firstName} {patient.lastName}
            </p>
            <p>Email : {patient.email}</p>
            <p>Mobile Number : {patient.contactNumber}</p>
                <div className=' flex gap-4 flex-wrap'>
                  <button
                  className='bg-cyan-500 text-white px-4 py-2 rounded w-fit hover:bg-neutral-700 border-neutral-500 border-[1px]'
                  >
                    Medical History 
                  </button>
                  <button className='border-[1px] flex items-center gap-2 border-neutral-500 text-white px-4 py-2 rounded w-fit hover:bg-neutral-700'>
                    Refer 
                    <img src={referIcon} className='w-[20px] h-[20px]' alt="refer"></img>
                  </button>
                </div>
        </div>
      </div>)}
      
    </>
        
    
  )
}

export default PatientCard