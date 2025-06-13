const mongoose = require("mongoose");

const nonceSchema = new mongoose.Schema({
    walletAddress: { 
        type: String, 
        required: true, 
        unique: true 
    },
    nonce: { 
        type: String, 
        required: true, 
        unique: true
    },
    createdAt: { 
        type: Date, 
        default: Date.now, 
        expires: 300 // Auto-delete after 5 minutes (300 seconds)
    }
});

module.exports = mongoose.model("Nonce", nonceSchema);
