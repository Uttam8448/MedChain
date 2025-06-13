import React, { useState, useEffect, useContext } from 'react'
import Card from '../../core/Dashboard/Card'
import {fetchPatientEHRs} from '../../../services/blockchainConnecter'; // Adjust the import based on your project structure
import { UserContext } from '../../../App';


const History = () => {
  const [loading, setLoading] = useState(false);
  const [timestamps, setTimestamps] = useState([]); // State to hold timestamps
  const [ipfsHashes, setIpfsHashes] = useState([]); // State to hold IPFS hashes
  const {user} =useContext(UserContext); // Assuming you have UserContext to get user data

  
  const fetchPatientHistory = async (e) => {
      try{
        // Call your API or smart contract here
        // Example: const data = await getPatientHistory();
        e.preventDefault();
        setLoading(true);
        console.log("Fetching patient history...");

        const result = await fetchPatientEHRs(user.walletAddress); // Fetch EHRs for the patient using their wallet address
        
        console.log("Fetched patient history:", result);
        setTimestamps(result.timestamps || []); // Set timestamps 
        setIpfsHashes(result.ipfsHashes || []); // Set IPFS hashes
        // Set state with fetched data if needed
        setLoading(false);
    }catch (error) {
      console.error("Error fetching patient history:", error);
      setLoading(false);  
    }
  }

  

  return (
    <div className='flex flex-col gap-6 w-[100%]'>
      <div className='border-b-[1px] pb-4'>
        <h2 className='text-2xl font-semibold'>Previous EHR</h2>
      </div>
      <button onClick={fetchPatientHistory} className={` text-white px-4 py-2 rounded w-fit font-bold ${loading ? 'bg-neutral-600' : 'bg-cyan-500'}`}>Fetch EHR</button>
      <div className='flex flex-wrap gap-6 justify-start w-fit'>
          {
          timestamps.map((timestamp, index) => (
            <Card 
              key={index} 
              title={`${new Date(timestamp * 1000).toLocaleString()}`} 
              ipfsHash={ipfsHashes[index]} // Pass IPFS hash to Card component
            />
          ))
          }
      </div>
    </div>
  )
}

export default History