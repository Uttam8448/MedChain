import toast from "react-hot-toast";
import { ethers} from "ethers";
import { endpoints } from "../apis";
import { apiConnector } from "../apiConnector";

const {
    GENERATE_NONCE,
} = endpoints;

export function connectWallet(){
   return async () =>{
    if(window.ethereum){
        try{
            const web3ProviderResponse = new ethers.BrowserProvider(window.ethereum);
            const signerResponse = await web3ProviderResponse.getSigner();
            const userAddressResponse=await signerResponse.getAddress();
            const userAddress = userAddressResponse.toString();
            console.log("User Address",userAddress);
            console.log("Signer",signerResponse);
            return {userAddress,signerResponse};
        }
        catch(error){
            console.log(error);
            toast.error("Error in connecting wallet");
        }
    }
    else{
        toast.error("Metamask not found");
    }
   }
}

export function signNonce(){
    return async (userAddress,signer)=>{
    try{
        // console.log("User Address",userAddress);
        // console.log("Signer",signer);
        // console.log("Calling for nonce");
        const response= await apiConnector("POST",GENERATE_NONCE,{
            walletAddress:userAddress,
        });
        if(response.status === 429){
            throw new Error(`Too many requests!!. 
                Please try again after 5 minutes.`);
        }
        if(response.status !== 200){
            throw new Error("Error in generating nonce");
        }
        // console.log("Result of nonce generation",response);
        const {nonce} =response.data;
        // console.log("Nonce Result",nonce);
        const signedNonceResponse = await signer.signMessage(nonce);
        const signedNonce = signedNonceResponse.toString();
        return signedNonce;
    }
    catch (error){
            toast.error(error.message);
    }
  }
}