const mongoose=require("mongoose");

const usershema=mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
    }
});

const usermodel=mongoose.model("userdata",usershema);

module.exports=usermodel;