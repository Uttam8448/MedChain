import React from 'react'

const Profile = ({user}) => {
  return (
    <div className='flex flex-col gap-6 w-[100%]'>
              <div className='border-b-[1px] pb-4'>
              <h2 className='text-2xl font-semibold'>Profile</h2>
              </div>
              <div className='flex w-[100%] justify-start'>
                <p className='w-[50%]'>Name : {user.firstName}</p>
                <p>Last Name : {user.lastName}</p>
              </div>
              <div className='flex w-[100%] justify-start'>
                <p className='w-[50%]'>Email : {user.email}</p>
                <p>Mobile Number : {user.contactNumber}</p>
              </div>
              {/* <div className='flex max-w-[100%] justify-start'>
                <p>Wallet Address : {user.walletAddress}</p>
            </div> */}
    </div>
  )
}

export default Profile