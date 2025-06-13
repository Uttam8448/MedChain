import React from 'react'
import File from "../../../images/File.jpg";

const Card = (  { title, ipfsHash }) => {

  return (
          <a href={`https://ipfs.io/ipfs/${ipfsHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-300 mt-2 flex flex-col w-fit">
              <img src={File} className='w-[250px] h-[125px] rounded-t-lg'></img>
              <div className='h-[50px]  border-l-[1px] border-b-[1px] border-r-[1px] border-neutral-400 bg-neutral-800 flex items-center justify-center'>
                  <p className="text-sm font-bold Orbitron" >{title}</p>
              </div> 
          </a>
          )}

      export default Card