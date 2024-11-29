const mongoose = require("mongoose");
const multer = require("multer");
const { type } = require("os");
const path = require("path");

const imagePath = "uploads"


const userSchema = mongoose.Schema({
    movieName: {
        type: String,
        required: true,
    },
    category: {
        type: Array,
        required: true,
    },
    image : {
        type : String,
        require : true,
    }
})



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname , ".." , imagePath))
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now()) ;
    }
  })
  

userSchema.statics.imageUpload =  multer({ storage: storage }).single("image")
userSchema.statics.imagePath = imagePath;

const UserModel = mongoose.model("userDatabase" , userSchema)

module.exports = UserModel