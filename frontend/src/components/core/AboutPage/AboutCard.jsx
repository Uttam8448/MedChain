import React from 'react'

const AboutCard = ({title,description}) => {
  return ( 
    <div className='w-[80%] flex flex-col gap-8 bg-black border-[1px] mx-auto m-8 p-6 rounded-xl bg-opacity-40 hover:bg-opacity-80 hover:shadow-neutral-700 shadow-md text-cyan-100 tracking-widest'>
        <div className='h-[20%] border-b-[1px]'>
            <h2 className='text-xl text-cyan-100 font-semibold pb-2 text-center tracking-widest'>{title}</h2>  
        </div>
       <div>
       {
       description.map((item,index)=>{
            return(
                 <div>
                <p className=' text-center' key={index}>{item}</p>
                <br/>
                </div>
            )
        })
        }
       </div>
    </div>
  )
}

export default AboutCard