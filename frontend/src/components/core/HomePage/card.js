import React from 'react'

const Card = ({title,description}) => {
  return (
    <div className='flex flex-col items-center gap-4 text-center border-[1px] p-6 py-8 rounded-xl bg-neutral-900 bg-opacity-40 hover:bg-opacity-80 hover:shadow-neutral-700 shadow-md w-[40%]'>
      <div className='border-b-[1px] w-[100%] mx-auto'>
        <h2 className='text-xl text-cyan-100 font-semibold pb-2'>{title}</h2>  
      </div>
    <p className=' text-center'>{description}</p>
    </div>
  )
}

export default Card