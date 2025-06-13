const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        trim:true,
        min:3,
        max:20,
        minlength: [3,'First name must be at least 3 characters long']
    },
    lastName:{
        type:String,
        trim:true,
        min:3,
        max:20,
        minlength: [3,'Last name must be at least 3 characters long']
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        lowercase:true,
        validate: {
            validator: function (v) {
                // Optional email validation
                return !v || /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
            },
            message: (props) => `Invalid email format: ${props.value}`,
        },
    },
    walletAddress:{
        type:String,
        // required:true,
        trim:true,
    },
    contactNumber:{  
        type:String,
        required:true,
        trim:true,
    },
    accountType:{
        type:String,
        enum:["Admin","Patient","Doctor"],
        required:true,
    },
   permissions: {
    type: [String],
    default: []
},
})

module.exports = mongoose.model("User",userSchema);