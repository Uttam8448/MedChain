import toast from 'react-hot-toast'
import { endpoints } from '../apis';
import { apiConnector } from '../apiConnector';

const {
    SIGN_UP,
    LOG_IN,
    GET_DOCTORS,
    PROVIDE_ACCESS,
    ACCESS_GRANTED,
    REVOKE_ACCESS,
    PATIENT_ACCESS
}=endpoints;



export async function signUp(formData){
        try{
            const response = await apiConnector("POST",SIGN_UP,{
                email:formData.email,
                firstName:formData.firstName,
                lastName:formData.lastName,
                walletAddress:formData.walletAddress,
                signedNonce:formData.signedNonce,
                contactNumber:formData.contactNumber,
                accountType:formData.accountType,
            })
            // console.log("SignUp Response",response);
            toast.success("Account Created Successfully");
            return response;
        }
        catch(error){
            console.log(error);
            toast.error("Error in signing up");
        }
}

export async function logIn(formData){
    try{
        const response = await apiConnector("POST",LOG_IN,{
            email:formData.email,
            walletAddress:formData.walletAddress,
            signedNonce:formData.signedNonce
        })
        // console.log("SignUp Response",response);
        return response;
    }
    catch(error){
        console.log(error);
        toast.error("Error in signing up");
    }
}

export async function getDoctors(){
    try{
        const token = JSON.parse(localStorage.getItem("token"));
        const headers =  {
                authorization: `Bearer ${token}`,
        }
        const response = await apiConnector("GET",GET_DOCTORS,{},headers);
        console.log("Doctors Response",response);
        return response;
    }
    catch(error){
        console.log(error);
        toast.error("Error in fetching doctors");
    }
}

export async function getAccessPatients() {
    try {
        const token = JSON.parse(localStorage.getItem("token"));
        const headers =  {
            authorization: `Bearer ${token}`,
        }
        const response = await apiConnector("GET", PATIENT_ACCESS, {}, headers);
        console.log("Patients Response", response);
        return response;
    }
    catch(error){
        console.log(error);
        toast.error("Error in fetching patients");
    }
}

export async function getAccessDoctors(){
    try{
        const token = JSON.parse(localStorage.getItem("token"));
        const headers =  {
                authorization: `Bearer ${token}`,
        }
        const response = await apiConnector("GET",ACCESS_GRANTED,{},headers);
        console.log("Doctors Response",response);
        return response;
    }
    catch(error){
        console.log(error);
        toast.error("Error in fetching doctors");
    }
}

export async function giveAccessToDoctor(doctorAddress){
    try{
        const token = JSON.parse(localStorage.getItem("token"));
        const headers =  {
                authorization: `Bearer ${token}`,
        }
        const response = await apiConnector("POST",PROVIDE_ACCESS,{doctorAddress},headers);
        return response;
    }
    catch(error){
        console.log(error);
    }
}

export async function revokeAccessFromDoctor(doctorAddress){
    try{
        const token = JSON.parse(localStorage.getItem("token"));
        const headers =  {
                authorization: `Bearer ${token}`,
        }
        const response = await apiConnector("POST",REVOKE_ACCESS,{doctorAddress},headers);
        return response;
    }
    catch(error){
        console.log(error);
    }
}