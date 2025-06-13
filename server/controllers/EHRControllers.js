

// const upload=require("../services/ipfsService");

// const { PinataSDK } = require("pinata-web3");

const {uploadEHRService} = require("../services/ipfsService");

require("dotenv").config();

let EHRCount=0; 

exports.uploadEHR = async (req, res) => {  
    try{
        // console.log("EHR upload request received", req.files);
        const {ehr} =req.files;
        // console.log("EHR data received at uploadEHR", ehr);
        // ehr.EHRCount=EHRCount;
        EHRCount++;
        const fileName = `${EHRCount}_${Date.now()}.json`;
        const ipfs =await uploadEHRService(ehr,fileName);
        // console.log("IPFS Hash:", ipfs);
        // if(!ipfs){
        //     return res.status(500).json({
        //         success:false,
        //         message:"Server Error",
        //     })
        // }
        return res.status(200).json({
            success:true,
            ipfsHash:ipfs,
            fileName:fileName,
            message:"EHR uploaded successfully",
        })
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"Error in uploading to IPFS",
        })
    }
}