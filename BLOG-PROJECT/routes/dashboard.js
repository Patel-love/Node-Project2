const express = require("express");
const usermodel = require("../model/usermodel");
const path = require("path");
const nodemailer = require("nodemailer");
const dashbordrouter = express.Router()

dashbordrouter.get("/", async (req, res) => {
  const cookieData = req.cookies["auth"];
  if (cookieData) {
    res.redirect("/dashboard");
    return;
  }
    res.render("singin")
})

dashbordrouter.get("/singup", (req, res) => {
    res.render("singup")

})


dashbordrouter.get("/dashboard",(req, res) => {
  const cookieData = req.cookies["auth"];
  if (!cookieData) {
    res.redirect("/")
    return;
  }
  res.render("dashboard",{cookieData});

})

dashbordrouter.post("/isartdata",usermodel.imgupload,async(req,res)=>{

    try {
        if (req.file) {
            req.body.profile=usermodel.imgepath+"/"+req.file.filename;
        };
        await usermodel.create(req.body);
        console.log("data add successfully");
        res.redirect("/")
        
    } catch (error) {
        console.log(error);
        
    }

});






dashbordrouter.get("/table",async(req, res) => {
  const cookieData = req.cookies["auth"];
  if (cookieData) {
    const userdata=await usermodel.find({})
    res.render("table",{userdata,cookieData})
    return;
  }
  res.render("/")
   

})

dashbordrouter.post(
    "/login",
    async(req, res) => {
     
      const { username, password } = req.body;
      console.log(username);
    
      const getUserData = await usermodel.findOne({ username: username });
      if (getUserData) {
        if (getUserData.password !== password) {
          console.log("Invalid password");
          res.redirect("/");
          return;
        }
      } else {
        console.log("User not found");
        res.redirect("/");
        return;
      }
      res.cookie("auth", getUserData);
        res.redirect("/dashboard");
    }
);

dashbordrouter.get("/logout", (req, res) => {
  res.clearCookie("auth");
    res.redirect("/")
})

dashbordrouter.get("/changepassword",(req,res)=>{
  const cookieData = req.cookies["auth"];
  if (cookieData) {

    res.render("changepassword")
    return;
  }
  res.redirect("/")
   
});

dashbordrouter.post("/newpassword",async(req,res)=>{
  const cookieData = req.cookies["auth"];
    const{oldpassword,newpassword,confimpassword}=req.body;
    const id=cookieData._id;
    const userdata=await usermodel.findById(id);
    if (oldpassword===userdata.password) {
        if (newpassword!==oldpassword) {
            if (newpassword===confimpassword) {
              await  usermodel.findByIdAndUpdate(userdata._id,{password:newpassword})
              res.redirect("/")
            } else {
        res.redirect("back")     
            }
        } else {
        res.redirect("back")
        }
    }else{
        res.redirect("back")
    } 
});


dashbordrouter.post("/forgotPassword", async (req, res) => {
    try {
      let getUser = await usermodel.findOne({useremail: req.body.forgotemail });
      if (!getUser) {
        console.log(getUser);
        
        return res.redirect("/");
      }
  
      let otp = Math.floor(Math.random() * 10000);
  
      res.cookie("getOtp2", otp);
      res.cookie("getemail2",getUser.useremail);
  
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "manavamrutiya29@gmail.com",
          pass: "zmkj mwbd soax jgcw",
        },
      });
  
      var mailOptions = {
        from: "manavamrutiya29@gmail.com",
        to: getUser.useremail,
        subject: "OTP",
        text: `OTP -${otp}`,
      };
  
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
          res.redirect("/otpPage");
        }
      });
    } catch (err) {
      console.log(err);
    }
  });
  
  dashbordrouter.get("/otpPage", (req, res) => {
    res.render("otp");
  });
  dashbordrouter.get("/forgotpassword", (req, res) => {
    res.render("forgotpassword");
  });
  
  
  dashbordrouter.post("/checkOtp", (req, res) => {
    const cookieOtp = req.cookies["getOtp2"];
    if(cookieOtp == req.body.otp){
     res.redirect("/forgotpassword");
    }
  });
  
  dashbordrouter.post("/forgotpassword2",async(req,res)=>{
    const{newpassword,confirmpassword}=req.body;
    const cookieemail = req.cookies["getemail2"];
    let getUser = await usermodel.findOne({useremail:cookieemail });
  
            if (newpassword===confirmpassword) {
              await  usermodel.findByIdAndUpdate(getUser._id,{password:newpassword})
              res.redirect("/")
            } else {
        res.redirect("back")     
            }
        
});


module.exports = dashbordrouter;
