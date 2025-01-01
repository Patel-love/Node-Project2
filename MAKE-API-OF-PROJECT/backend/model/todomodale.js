const mongoose=require("mongoose");

const todoshema=mongoose.Schema({
    todoid:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "userdata",
        required: true,
    },
    todoName:{
        type: String,
        required: true,
    },
   
});

const todomodel=mongoose.model("tododata",todoshema);

module.exports=todomodel;