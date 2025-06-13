import React from 'react'
import DocCard from '../../core/Dashboard/DocCard'

const AccessGranted = ({currentActive,accessDoctorsData,setDoctorsData,setAccessDoctorsData}) => {
  return (
    <div className='flex flex-col gap-6 w-[100%]'>
                  <div className=' border-b-[1px] pb-4 '>
                  <h2 className='text-2xl font-semibold '>Access Granted</h2>
                  </div>
                  <div className='flex flex-wrap gap-6 justify-start w-[100%]'>
                    {
                      accessDoctorsData.map((doctor, index) => (
                       <DocCard key={index} currentActive={currentActive} doctor={doctor} setDoctorsData={setDoctorsData} setAccessDoctorsData={setAccessDoctorsData}/>
                    ))}
                  </div>
    </div>
  )
}

export default AccessGranted