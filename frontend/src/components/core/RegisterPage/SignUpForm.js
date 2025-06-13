import React, { useState } from 'react'
import { useContext } from 'react';
import { UserContext } from '../../../App';
import { connectWallet, signNonce } from '../../../services/walletServices/walletServices';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';

import { signUp } from '../../../services/authServices/authServices';

import { registerUsers} from '../../../services/blockchainConnecter';

//handle the type of account creation

const SignUpForm = ({clientType,setClientType}) => {
    const { token,setToken,setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [formData,setFormData] = useState({
    email:"",
    firstName:"",
    lastName:"",
    contactNumber:"",
  })

  const [loading,setLoading] = useState(false);

  const handleChange = (e)=>{
     setFormData((prevData)=>({
        ...prevData,
        [e.target.name]:e.target.value
     }))
  }

  const typeChange = (e)=>{
    e.preventDefault();
    setClientType(clientType===1 ? 2 : 1);
    setFormData({
        email:"",
        firstName:"",
        lastName:"",
        contactNumber:"",
    });
  }

  //Steps : signNonce: Generate Nonce, Sign Nonce => signUp: 
  const submitHandler = async (e) =>{
    e.preventDefault();
    setLoading(true);
    try{
        const {userAddress,signerResponse}=await connectWallet()();
        const signedNonce=await signNonce()(userAddress,signerResponse);

        // console.log("User Address",userAddress);
        // console.log("Signed Nonce",signedNonce);
        formData.walletAddress=userAddress;
        formData.signedNonce=signedNonce;
        formData.accountType=clientType;
        // console.log("Form Data",formData);
        const signUpResponse=await signUp(formData);
        console.log("SIGNUP", signUpResponse);

        if(signUpResponse.status===200){
            localStorage.setItem("token",JSON.stringify(signUpResponse.data.token));
            localStorage.setItem("user",JSON.stringify(signUpResponse.data.user));
            await registerUsers(formData.accountType);
            setToken(signUpResponse.data.token);
            setUser(signUpResponse.data.user);
            // console.log("User Registered Successfully Token: ",token);
            navigate("/dashboard");
            toast.success("Successfully Signed Up");
        }
        else{
            throw new Error("Error in signing up");
        }
        setFormData({
            email:"",
            firstName:"",
            lastName:"",
            walletAddress:"",
            contactNumber:"",
        });
    }
    catch(error){
        //handle the error in signing up later
        toast.error("Error in Signing Up");
    }
    finally{
        setLoading(false);
    }
  }
  return (
      <form
          onSubmit={submitHandler}
          className='flex rounded-xl px-10 py-6  text-white tracking-widest'
        >
        <div className='flex flex-col gap-8'>
        <h1 className='text-2xl font-bold text-cyan-400'>Register</h1>
        
        <div className='flex flex-col gap-4 '>
            <div className={`flex rounded-md bg-neutral-900 border-[1px] max-w-fit`}>
            <button  className={`${clientType===1 ? "bg-neutral-700" : ""} p-2`} onClick={typeChange}>Patient</button> 
            <button  className={`${clientType===2 ? "bg-neutral-700" : ""} p-2`} onClick={typeChange}>Doctor</button>
            </div>
            <div className='flex gap-4'>
                <label htmlFor="firstName" >
                First Name<br/>
                    <input
                    required
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder='Enter First Name'
                    className='p-2 rounded-sm bg-neutral-700 text-cyan-50'
                    >
                    </input></label>
                    <label htmlFor="lastName">Last Name<br/>
                    <input
                    required
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder='Enter Last Name'
                    className='p-2 rounded-sm bg-neutral-700 text-cyan-50'
                    >
                    </input>
                </label>
            </div>
            <div>
                <label htmlFor="email" className='text-cyan-50'>
                    E-mail Address <br/>
                    <input
                        required
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder='Enter E-mail Address'
                        className='p-2 rounded-sm bg-neutral-700 text-cyan-50 w-[100%]'
                    >
                    </input>
                </label>
            </div>
            <div>
                <label htmlFor="contactNo" className='text-cyan-50'>
                    Contact Number <br/>
                    <input
                        required
                        type="text"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleChange}
                        placeholder='Enter Contact Number'
                        className='p-2 rounded-sm bg-neutral-700 text-cyan-50 w-[100%]'
                    >
                    </input>
                </label>
            </div>
        </div>
        <button type='submit' className={`border-[1px] rounded-md p-2 ${loading ?`bg-neutral-700 text-cyan-400`: `bg-cyan-400 text-neutral-900`}  font-bold tracking-widest `}>
            {loading ? <div>Loading
                <TypeAnimation sequence={[1000,".",1000,"..",1000,"...",1000,""]} 
                repeat={Infinity} 
                cursor={false}/></div> : "Connect Wallet"}
        </button>
        </div>
        {/* <img src=''></img> */}
      </form>
  )
}

export default SignUpForm