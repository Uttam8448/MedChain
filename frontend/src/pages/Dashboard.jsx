import React, { useState } from 'react'

import EHRUploadForm from '../components/core/Dashboard/EHRUpload';
import Sidebar from '../components/base/dashboard/Sidebar';
import Profile from '../components/base/dashboard/Profile';
import History from '../components/base/dashboard/History';
import AccessGranted from '../components/base/dashboard/AccessGranted';
import ProvideAccess from '../components/base/dashboard/ProvideAccess';
import Patients from '../components/base/dashboard/Patients';

import { useContext } from 'react';
import { UserContext } from '../App';
import LogOutCard from '../components/core/Dashboard/LogOutCard';
import GetPrediction from '../components/core/Dashboard/GetPrediction';


const Dashboard = () => {
  const [currentActive,setcurrentActive]=useState("profile");
  const [doctorsData,setDoctorsData] = useState([]);
  const [accessDoctorsData,setAccessDoctorsData] = useState([]);
  const {user} = useContext(UserContext);

  return (
    <div className='w-[100%] mx-auto gap-10 flex Orbitron tracking-widest text-cyan-100'>
        <Sidebar currentActive={currentActive} setcurrentActive={setcurrentActive} setDoctorsData={setDoctorsData} setAccessDoctorsData={setAccessDoctorsData}/>
        <div className='w-[70%] h-fit bg-neutral-900 flex flex-col p-10 m-10 mr-6 mx-auto items-center rounded-2xl'>
            {
              currentActive==="profile" &&
              (
                <Profile user={user}/>
              )
              }
            {
              currentActive==="upload" &&
              (
                <EHRUploadForm/>
              )
            }
            {
              currentActive==="history" &&
              (
                <History check={0} walletAddress={""}/>
              )
            }
            {
              currentActive==="accessGranted" && 
              (
                <AccessGranted currentActive={currentActive} accessDoctorsData={accessDoctorsData} setAccessDoctorsData={setAccessDoctorsData}/>
              )
            }
            {
              currentActive==="giveAccess" && 
              (
                <ProvideAccess currentActive={currentActive} doctorsData={doctorsData} setDoctorsData={setDoctorsData}/>
              )
            }
            {
              currentActive==="patients" && 
              (
                <Patients/>
              )
            }
             {
              currentActive==="logout" &&
              (
                <LogOutCard/>
              )
            }
            {
              currentActive==="getPrediction" &&
              (
                <GetPrediction/>
              )
            }
        </div>
    </div>
  )
}

export default Dashboard