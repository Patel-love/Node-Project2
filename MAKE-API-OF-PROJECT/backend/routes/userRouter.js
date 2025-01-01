const express = require("express");
const bcrypt = require("bcrypt");
const usermodel = require("../model/usermodel");
const jwt = require("jsonwebtoken");
const userRouter=express.Router();
const dotenv = require("dotenv");
dotenv.config();

userRouter.post("/adduser",async(req,res)=>{
    try{
    const existEmail = await usermodel.findOne({ email: req.body.email });

    if (!existEmail) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
      await usermodel.create(req.body);
      res.status(201).json({ message: "User registered successfully" });
    } else {
      res.status(200).json({ message: "This email already exists" });
    }
  } catch (err) {
    res.status(400).json({ message: err });
  }
})



userRouter.post("/login", async (req, res) => {

  try {
    const user = await usermodel.findOne({ email: req.body.email });
    if (user) {
      if (await bcrypt.compare(req.body.password, user.password)) {
        const token = jwt.sign({ user }, process.env.SECRET_KEY, {
          expiresIn: "1h",
        });

        return res.status(200).json({ message: "login Successfully", token ,email:user.email,name:user.name});
      } else {
        res.status(400).json({ message: "invalid Password" });
      }
    } else {
      res.status(404).json({ message: "invalid email" });
    }
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err });
  }
});

  




module.exports=userRouter;