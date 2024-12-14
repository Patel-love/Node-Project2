const mongoose =require("mongoose");

const multer=require("multer");

const path=require("path")

const imgpath="/uploads"

const userchema=mongoose.Schema({
    profile:{
        type:"string",
        required:true
    },
    username:{
        type:"string",
        required:true
    },
    useremail:{
        type:"string",
        required:true
    },
    password:{
        type:"string",
        required:true
    },
    country:{
        type:"string",
        required:true
    }
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null,path.join(__dirname,"..",imgpath))
    },
    filename: function (req, file, cb) {
     
      cb(null, file.fieldname + '-' + Date.now())
    }
  })
  
userchema.statics.imgupload = multer({ storage: storage }).single("profile")

userchema.statics.imgepath=imgpath;



const usermodel=mongoose.model("userdata",userchema);

module.exports=usermodel;