const {ethers } = require("ethers");
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const otpGenerator = require("otp-generator");
const {isAddress, verifyMessage} = require('ethers');

const Nonce = require("../models/NonceModel");
const User = require("../models/User");
const Token = require("../models/Token");

const mailSender = require("../utils/mailSender");



require("dotenv").config();


exports.signUp = async (req,res) =>{
    try{
        const {firstName,lastName,email,accountType,walletAddress,contactNumber} = req.body;
        
        if(!firstName || !lastName || !email || !accountType || !walletAddress || !contactNumber){
            return res.status(400).json({
                success:false,
                message:"All fields are required",
            })
        }
        let accType;
        if(accountType==1){
            accType="Patient"
        }
        else if(accountType==2){
            accType="Doctor"
        }
        else{
            throw new Error("Invalid account type");
        }
        if(!isAddress(walletAddress)){
            return res.status(400).json({
                success:false,
                message:"Invalid Wallet Address",
            })
        }
        const userExists = await User.findOne({email});
        if(userExists){
            return res.status(400).json({
                success:false,
                message:"User already exists",
            })
        }
        // const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });        
        const user = new User({
            firstName,
            lastName,
            email,
            accountType:accType,
            walletAddress,
            contactNumber
        });
        await user.save();
        const token=jwt.sign({walletAddress},process.env.JWT_SECRET,{expiresIn:'1d'});
        await Token.findOneAndDelete({walletAddress});
        const tokenRecord = new Token({
            walletAddress,
            token,
        });
        tokenRecord.save();

        return res.status(200).json({
            success:true,
            token,
            user,
            message:`${accountType} registered successfully`,
        })
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"Error in SignUp",
        })
    }
}


async function generateNonce(walletAddress) {
    const nonce = Math.floor(Math.random() * 1000000).toString(); // Random 6-digit nonce
    await Nonce.findOneAndUpdate(
        { walletAddress },
        { nonce, createdAt: new Date() },
        { upsert: true, new: true }
    );

    return nonce;
}
exports.generateNonce = async (req,res) =>{
    try{
        const {walletAddress} = req.body;
        // console.log("walletAddress for nonce generation ",walletAddress);
        if(!walletAddress){
            return res.status(400).json({
                success:false,
                message:"Wallet Address is required",
            })
        }
        const nonceAlreadyExists = await Nonce.findOne({ walletAddress });
        // console.log("nonceAlreadyExists",nonceAlreadyExists);
        if (nonceAlreadyExists) {
            return res.status(429).json({
                success:false,
                message:"Nonce Already exists.Try after 5 minutes for new nonce to connnect from new device!!",
                nonce:nonceAlreadyExists.nonce,
            })
        }
        const nonce = await generateNonce(walletAddress);
        return res.status(200).json({
            success:true,
            message:"Nonce generated successfully",
            nonce,
        })
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"Error in generating nonce",
        })
    }
}

exports.verifyNonce=async (req,res)=>{
    try{
        const {walletAddress, signedNonce} = req.body;
        if(!walletAddress || !signedNonce){
            return res.status(400).json({
                success:false,
                message:"Wallet Address and signed nonce are required",
            })
        }
        const record = await Nonce.findOne({ walletAddress });
    
        if (!record) throw new Error("Nonce expired or not found");
        // console.log(record);
        // Recover the signer address
        const recoveredAddress = verifyMessage(record.nonce, signedNonce);
        // console.log(recoveredAddress);
        if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
            throw new Error("Signature verification failed");
        }
    
        // Delete nonce after successful verification
        await Nonce.deleteOne({ walletAddress });
    
        return res.status(200).json({
            success: true,
            message:"User authenticated successfully"
        });
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"Error in verifying nonce",
        })
    }
}


exports.logIn = async (req,res) =>{     
    try{
        const {email,walletAddress} = req.body;
        if(!email){
            return res.status(400).json({
                success:false,
                message:"Email is required",
            })
        }
        const user = await User.findOne({walletAddress:walletAddress});
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User Not Found"
            })
        }

        const token=jwt.sign({walletAddress},process.env.JWT_SECRET,{expiresIn:'1d'});
        await Token.findOneAndDelete({walletAddress});
        const tokenRecord = new Token({
            walletAddress,
            token,
        })
        tokenRecord.save();
        return res.status(200).json({
            success:true,
            token,
            user,
            message:`You are successfully logged in!`
        })
    }
    catch(error){
        console.error(error);
        return res.status(400).json({
            success:false,
            message:"Error in Login",
        })
    }
}

exports.getDoctor = async (req, res) => {
    try {
        // Get the requesting user's wallet address
        const patientWalletAddress = req.user.walletAddress;

        // Fetch the patient user to get their permissions array
        const patient = await User.findOne({ walletAddress: patientWalletAddress });
        if (!patient) {
            return res.status(404).json({
                success: false,
                message: "Patient not found",
            });
        }

        // Get the list of doctor wallet addresses already in permissions
        const excludedDoctors = patient.permissions || [];

        // Find all doctors not in the permissions list
        const doctors = await User.find({
            accountType: "Doctor",
            walletAddress: { $nin: excludedDoctors }
        });

        return res.status(200).json({
            success: true,
            doctors,
            message: "Doctors fetched successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error fetching doctors",
        });
    }
};

exports.provideAccess = async (req, res) => {
     try {
        const { doctorAddress } = req.body;
        const doctorAdd = doctorAddress.toString(); // Normalize address to lowercase
        const patientWalletAddress = req.user.walletAddress; // Assuming user is authenticated and has a wallet address
        const patientAdd = patientWalletAddress.toString(); // Normalize address to lowercase
        if (!patientWalletAddress || !doctorAdd) {
            return res.status(400).json({
                success: false,
                message: "Both patientWalletAddress and doctorWalletAddress are required",
            });
        }

        // Find the patient user
        const patient = await User.findOne({ walletAddress: patientWalletAddress });
        const doctor = await User.findOne({ walletAddress: doctorAddress });
        
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found",
            });
        }


        if (!patient) {
            return res.status(404).json({
                success: false,
                message: "Patient not found",
            });
        }

        // Add doctorWalletAddress if not already present
        if (!patient.permissions.includes(doctorAdd)) {
            patient.permissions.push(doctorAdd);
            await patient.save();
        }
        if(!doctor.permissions.includes(patientAdd)) {
            doctor.permissions.push(patientAdd);
            await doctor.save();
        }

        return res.status(200).json({
            success: true,
            message: "Doctor access provided successfully",
            permissions: patient.permissions,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error providing access",
        });
    }
};

exports.accessGranted = async (req, res) => {
    try {
        const patientWalletAddress = req.user.walletAddress;

        // Fetch the patient user to get their permissions array
        const patient = await User.findOne({ walletAddress: patientWalletAddress });
        if (!patient) {
            return res.status(404).json({
                success: false,
                message: "Patient not found",
            });
        }

        // Get the list of doctor wallet addresses in permissions
        const grantedDoctors = patient.permissions || [];

        // Find all doctors whose walletAddress is in the permissions list
        const doctors = await User.find({
            accountType: "Doctor",
            walletAddress: { $in: grantedDoctors }
        });

        return res.status(200).json({
            success: true,
            doctors,
            message: "Doctors with access fetched successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error fetching doctors with access",
        });
    }
};

exports.revokeAccess = async (req, res) => {
    try {
        const { doctorAddress } = req.body;
        const patientWalletAddress = req.user.walletAddress;
        const doctorAdd = doctorAddress.toString(); // Normalize address to lowercase
        const patientAdd = patientWalletAddress.toString(); // Normalize address to lowercase
        if (!patientWalletAddress || !doctorAddress) {
            return res.status(400).json({
                success: false,
                message: "Both patientWalletAddress and doctorAddress are required",
            });
        }

        // Find the patient user
        const patient = await User.findOne({ walletAddress: patientWalletAddress });
        const doctor = await User.findOne({ walletAddress: doctorAddress });
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found",
            });
        }
        if (!patient) {
            return res.status(404).json({
                success: false,
                message: "Patient not found",
            });
        }

        // Remove the doctorAddress from permissions array if present
        patient.permissions = (patient.permissions || []).filter(
            addr => addr !== doctorAdd
        );

        doctor.permissions = (doctor.permissions || []).filter(
            addr => addr !== patientAdd
        );
        await patient.save();
        await doctor.save();
        return res.status(200).json({
            success: true,
            message: "Doctor access revoked successfully",
            permissions: patient.permissions,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error revoking access",
        });
    }
};

exports.accessPatient = async (req, res) => {
    try {
        const doctorWalletAddress = req.user.walletAddress; // Assuming user is authenticated and has a wallet address

        // Fetch the doctor user to get their permissions array
        const doctor = await User.findOne({ walletAddress: doctorWalletAddress });
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found",
            });
        }

        // Get the list of patient wallet addresses in permissions
        const grantedPatients = doctor.permissions || [];
        console.log("grantedPatients", grantedPatients);
        // Find all patients whose walletAddress is in the permissions list
        const patients = await User.find({
            accountType: "Patient",
            walletAddress: { $in: grantedPatients }
        });

        return res.status(200).json({
            success: true,
            patients,
            message: "Patients with access fetched successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error fetching patients with access",
        });
    }
}