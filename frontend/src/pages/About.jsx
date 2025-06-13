import React from 'react'
import AboutCard from '../components/core/AboutPage/AboutCard'
import { AboutData } from '../data/AboutData'

const About = () => {
  return (
    <div className='Orbitron mx-auto w-[70%]'>
      {
      AboutData.map((item,index)=>{
        return(
          <AboutCard title={item.title} description={item.description} key={index}/>
        )})
      }
      
    </div>
  )
}

export default About