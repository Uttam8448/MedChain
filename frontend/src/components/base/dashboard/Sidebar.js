import React, { useContext } from 'react'
import { useState } from 'react'
import { UserContext } from '../../../App'
import { getAccessDoctors, getDoctors } from '../../../services/authServices/authServices';

const Sidebar = ({currentActive,setcurrentActive,setDoctorsData,setAccessDoctorsData}) => {
  const {user} = useContext(UserContext);
  const accountType = user.accountType;

  const handleProvideAccess = async (e) => {
    e.preventDefault();
    setcurrentActive("giveAccess");
    const result = await getDoctors();
    setDoctorsData(result.data.doctors);
    // c
  }

  const handleAccessGranted = async (e) => {
    e.preventDefault();
    setcurrentActive("accessGranted");
    const result = await getAccessDoctors();
    console.log("Access Granted Data", result.data.doctors)
    setAccessDoctorsData(result.data.doctors);
  }

  return (
    <div className='min-h-[calc(100vh-72px)] w-[25%] bg-neutral-900 flex flex-col border-r-[1px] fixed'>
            <div className={` text-md font-semibold  p-2 py-4 border-b-[1px] cursor-pointer ${currentActive==="profile"? "bg-gradient-to-l from-neutral-900 via-neutral-700  to-neutral-600":"bg-neutral-900"}  `} onClick={()=>setcurrentActive("profile")} >Profile</div>
            {
              accountType==="Patient" &&
              <>
                <div className={` text-md font-semibold  p-2 py-4 border-b-[1px] cursor-pointer ${currentActive==="upload"? "bg-gradient-to-l from-neutral-900 via-neutral-700  to-neutral-600":"bg-neutral-900"}  `} onClick={()=>setcurrentActive("upload")}>Upload EHR</div>
                <div className={` text-md font-semibold  p-2 py-4 border-b-[1px] cursor-pointer ${currentActive==="giveAccess"? "bg-gradient-to-l from-neutral-900 via-neutral-700  to-neutral-600":"bg-neutral-900"}  `} onClick={handleProvideAccess}>Provide Access</div>
                <div className={` text-md font-semibold  p-2 py-4 border-b-[1px] cursor-pointer ${currentActive==="history"? "bg-gradient-to-l from-neutral-900 via-neutral-700  to-neutral-600":"bg-neutral-900"}  `} onClick={()=>setcurrentActive("history")}>Previous EHR</div>
                <div className={` text-md font-semibold  p-2 py-4 border-b-[1px] cursor-pointer ${currentActive==="accessGranted"? "bg-gradient-to-l from-neutral-900 via-neutral-700  to-neutral-600":"bg-neutral-900"}  `} onClick={handleAccessGranted}>Access Granted</div>
              </>
            }
            {
              accountType==="Doctor" &&
              <>
                <div className={` text-md font-semibold  p-2 py-4 border-b-[1px] cursor-pointer ${currentActive==="patients"? "bg-gradient-to-l from-neutral-900 via-neutral-700  to-neutral-600":"bg-neutral-900"}  `} onClick={()=>setcurrentActive("patients")}>Patient Records</div>
                <div className={` text-md font-semibold  p-2 py-4 border-b-[1px] cursor-pointer ${currentActive==="getPrediction"? "bg-gradient-to-l from-neutral-900 via-neutral-700  to-neutral-600":"bg-neutral-900"}  `} onClick={()=>setcurrentActive("getPrediction")}>Get Predictions</div>          
              </>
            }
            <div className={` text-md font-semibold  p-2 py-4 border-b-[1px] cursor-pointer ${currentActive==="logout"? "bg-gradient-to-l from-neutral-900 via-neutral-700 to-neutral-600":"bg-neutral-900"}  `} onClick={()=>setcurrentActive("logout")}>Logout</div>
        </div>
  )
}

export default Sidebar