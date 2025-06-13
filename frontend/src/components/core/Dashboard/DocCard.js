import React from 'react'
import DocCardImage from "../../../images/DocCardImage.png";
import { grantFullAccess,revokeAccess } from '../../../services/blockchainConnecter';
import { giveAccessToDoctor, revokeAccessFromDoctor } from '../../../services/authServices/authServices';
import toast from 'react-hot-toast';
import { getDoctors,getAccessDoctors } from '../../../services/authServices/authServices';

const DocCard = ({currentActive,doctor,setDoctorsData,setAccessDoctorsData}) => {

  const provideAccessHandler = async (e) => {
    e.preventDefault();
    const cresult = await grantFullAccess(doctor.walletAddress);
    console.log("CResult", cresult);
    if(!cresult) {  
      toast.error("Error in granting access to doctor on blockchain");
      return;
    }
    const result=await giveAccessToDoctor(doctor.walletAddress);
    if(result.status === 200) {
      toast.success("Access Granted to Doctor");
      const result = await getDoctors();
      setDoctorsData(result.data.doctors);
    } else {
      toast.error("Error in granting access to doctor");
    }
  }

  const removeAccessHandler = async (e) => {
    e.preventDefault();
    const rresult=await revokeAccess(doctor.walletAddress);
    if(!rresult) {  
      toast.error("Error in granting access to doctor on blockchain");
      return;
    }
    const result = await revokeAccessFromDoctor(doctor.walletAddress);
    if(result.status === 200) {
      toast.success("Access Revoked from Doctor");
      const result = await getAccessDoctors();
      setAccessDoctorsData(result.data.doctors);
    } else {
      toast.error("Error in revoking access from doctor");
    }
  }

  return (
    <div className='flex gap-8 w-[100%] border-[1px] border-slate-400 rounded-lg bg-neutral-800 Orbitron'>
        <div className='p-3 bg-neutral-800 rounded-l-lg border-r-[1px] border-neutral-400'><img src={DocCardImage} className='w-[150px] h-[150px] rounded-t-lg'></img></div>
        <div className='h-[100%] flex flex-col justify-evenly tracking-widest'>
            <p>Name : {doctor.firstName} {doctor.lastName}</p>
            <p>Email : {doctor.email}</p>
            <p>Mobile Number : {doctor.contactNumber}</p>
            { currentActive==="accessGranted" ?
                (<button
                  className='bg-red-500 text-white px-4 py-2 rounded w-fit'
                  onClick={removeAccessHandler}
                  >
                    Remove Access
                  </button>
                ) :
                (<button
                  className='bg-cyan-500 text-white px-4 py-2 rounded w-fit'
                  onClick={provideAccessHandler}
                  >
                    Provide Access
                  </button>)
            }
        </div>
    </div>

  )
}

export default DocCard