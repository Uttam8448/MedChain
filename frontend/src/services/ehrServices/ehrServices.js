import toast from 'react-hot-toast'
import { ehrEndpoints } from '../apis';
import { apiConnector } from '../apiConnector';


const {
    UPLOAD_EHR
}=ehrEndpoints;


export const uploadEHR = async (formData) => {
    const body=formData;
    const token = JSON.parse(localStorage.getItem("token"));
    const headers =  {
                'Content-Type': 'multipart/form-data',
                authorization: `Bearer ${token}`,
            }
    
    try {
        console.log("Token ",token);
        console.log("Formdata from uploadEHR",formData);

        const response = await apiConnector("POST", UPLOAD_EHR, body, headers);
        
        console.log("EHR Upload Response", response);
        alert("EHR Uploaded Successfully");
        toast.success("EHR Uploaded Successfully");
        return response;
    }
    catch (error) {
        console.log(error);
        toast.error("Error in uploading EHR");
    }
}