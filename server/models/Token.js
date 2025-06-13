const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({   
    walletAddress:{
        type:String,
        required:true,
        unique:true,
    },
    token:{
        type:String,
        required:true,
        expires: 86400,
    }
})

module.exports = mongoose.model("Token",tokenSchema);