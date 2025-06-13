import React, { useState } from 'react'
import { useContext } from 'react';
import { UserContext } from '../../../App';
import { connectWallet, signNonce } from '../../../services/walletServices/walletServices';
import { logIn } from '../../../services/authServices/authServices';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { TypeAnimation } from 'react-type-animation';

const  LogInForm = () => {
  const [email,setEmail] = useState("");
  const navigate = useNavigate();
  const [loading,setLoading] = useState(false);
    const { token,setToken,setUser } = useContext(UserContext);


  async function handleOnSubmit(e){
      e.preventDefault();
      setLoading(true);
      try{
            const {userAddress,signerResponse}=await connectWallet()();
            const signedNonce=await signNonce()(userAddress,signerResponse);
            const formData={
                email,
                walletAddress:userAddress,
                signedNonce,  
            }
            const logInResponse=await logIn(formData);
            if(!logInResponse){
                throw new Error("Error in logging in");
            }
            localStorage.setItem("token",JSON.stringify(logInResponse.data.token));
            localStorage.setItem("user",JSON.stringify(logInResponse.data.user));
            setToken(logInResponse.data.token);
            setUser(logInResponse.data.user);
            console.log("User Registered Successfully Token: ",token);
            toast.success("Logged In Successfully");
            navigate("/dashboard");
      }
      catch(error){
          console.log(error);
          toast.error("Error in signing up");
      }
      finally{
          setLoading(false);
      }
  }


  return (
      <form
          onSubmit={handleOnSubmit}
          className='flex  rounded-xl w-[80%] py-10   text-white tracking-widest'
        >
        <div className='flex flex-col w-[100%] gap-8'>
        <h1 className='text-2xl font-bold text-cyan-400'>Log In</h1>
        <div className='flex flex-col gap-2 '>
        <label htmlFor="email" className='text-cyan-50'>
          E-mail Address
        </label>
        <input
              required
              type="email"
              name="email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              placeholder='Enter E-mail Address'
              className='p-2 rounded-sm bg-neutral-700 text-cyan-50 w-[100%]'
          >
          </input>
        </div>
        <button type='submit' className={`border-[1px] rounded-md p-2 ${loading ?`bg-neutral-700 text-cyan-400`: `bg-cyan-400 text-neutral-900`}  font-bold tracking-widest `}>
            {loading ? <div>Loading
                <TypeAnimation sequence={[1000,".",1000,"..",1000,"...",1000,""]} 
                repeat={Infinity} 
                cursor={false}/></div> : "Connect Wallet"}
        </button>
        </div>
      </form>
  )
}

export default LogInForm