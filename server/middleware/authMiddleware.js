const Nonce = require("../models/NonceModel");
const Token = require("../models/Token");

const jwt = require("jsonwebtoken");
const User = require("../models/User");
const {verifyMessage} = require("ethers");

require("dotenv").config();

exports.verifyNonce=async (req,res,next)=>{
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
        // await Nonce.deleteOne({ walletAddress });
        
        next();
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"Error in verifying nonce",
        })
    }
}



exports.auth=async (req,res,next)=>{
    try{
        const token = req.headers.authorization.split(" ")[1];
        // console.log("Body received", req.body);
        // console.log("Files received", req.files.ehr);
        if(!token){
            return res.status(401).json({
                success:false,
                message:"Token is required",
            })
        }
        const decoded =jwt.verify(token,process.env.JWT_SECRET);
        // console.log("Decoded",decoded);
        const tokenFetch=await Token.findOne({walletAddress:decoded.walletAddress});
        if(!tokenFetch || tokenFetch?.token!==token){
            return res.status(401).json({
                success:false,
                message:"Token Expired or Invalid",
            })
        }
        const user=await User.findOne({walletAddress:decoded.walletAddress});
        // console.log("Auth Done User",user);
        req.user=user;
        next();
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"Error!! Token Expired or Invalid",
        })
    }
}

exports.isPatient=async (req,res,next)=>{
    try{
        const user=req.user;
        if(user.accountType!=="Patient"){
            return res.status(403).json({
                success:false,
                message:"Access Forbidden",
            })
        }
        // console.log("User is Patient Middleware",user);
        next();
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"Error!! You are not a patient",
        })
    }
}

exports.isDoctor=async (req,res,next)=>{
    try{
        const user=req.user;
        if(user.accountType!=="Doctor"){
            return res.status(403).json({
                success:false,
                message:"Access Forbidden",
            })
        }
        next();
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"Error!! You are not a doctor",
        })
    }
}