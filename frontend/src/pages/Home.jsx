import React from 'react'
import {TypeAnimation} from "react-type-animation";
import Card from "../components/core/HomePage/card.js";
import home11 from "../images/home11.png";
import { descriptionArray } from '../data/descriptionArray.js';
import blockchain from "../images/blockchain.png";

const Home = () => {
  const text = ` Blockchain`;
  const text2 = ` Machine Learning`;


  return (
    <div className='flex flex-col items-center mx-auto text-cyan-100 tracking-widest Orbitron gap-8 w-[70%]' >
      <img src={blockchain} alt="logo" width="40%" className='pt-10' ></img>

      <div className='mb-8'>
        <h1 className='font-bold text-5xl  text-center m-4'>MedChain – 
          Decentralized Patient Health Record Storage</h1>
        <h2 className='font-semibold text-center tracking-widest'>Revolutionizing Healthcare with 
          <TypeAnimation
          sequence={[text,3000,text2,3000,""]}
          repeat={Infinity}
          cursor={true}
          style = {
            {
                whiteSpace:"pre-line",
            }
        }
        omitDeletionAnimation={true}
          />
        </h2>
      </div>
      <div className='flex flex-wrap gap-4 justify-center' >
        {
          descriptionArray.map((item,index)=>{
          return(
            <Card title={item.title} description={item.description} key={index}/>
          )
          })
        }
      </div>
     
    </div>
  )
}

export default Home