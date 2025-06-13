import React,{useState} from 'react'
import PatientCard from '../../core/Dashboard/PatientCard'
import { IoIosArrowForward } from "react-icons/io";
import { getAccessPatients } from '../../../services/authServices/authServices';

const Patients = () => {
  const [patients,setPatients] = useState([]);
  const fetchPatients = async () => {
    const result=await getAccessPatients();
    setPatients(result.data.patients);
  }
  return (
    <div className='flex flex-col gap-6 w-[100%]'>
                  <div className='border-b-[1px] pb-4 flex gap-2 items-center'>
                    <h2 className='text-2xl font-semibold'>Patients</h2>
                    <IoIosArrowForward className='w-[20px] h-[20px]'/>
                    <h2 className='text-2xl font-semibold'></h2>
                  </div>
                  <button onClick={fetchPatients} className={` text-white px-4 py-2 rounded w-fit font-bold bg-cyan-500`}>Fetch Patients</button>
                  <div className='flex flex-wrap gap-6 justify-start w-[100%]'>
                  {
                     
                      patients.length > 0 ? 
                      patients.map((patient,index) => (
                        <PatientCard key={index} patient={patient} />
                      )) :
                      <p className='text-white'>No Patients Found</p>
                    }
                    
                  </div>
    </div>
  )
}

export default Patients