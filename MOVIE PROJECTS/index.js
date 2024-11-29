const express = require("express");
const connection = require("./config/db");
const UserModel = require("./model/userModel");
const path = require("path")
const fs = require("fs")
const PORT = 8083;

const app = express()

app.set("view engine", "ejs")
app.use(express.urlencoded())
app.use("/uploads" , express.static(path.join(__dirname , "uploads")) )

app.get("/", async (req, res) => {
    try {
        const userData = await UserModel.find({})
        res.render("navbar" ,{ userData })
    } catch (error) {
        console.log(error)
    }
})

app.get("/insertData", async (req, res) => {
    try {
        const userData = await UserModel.find({})
        res.render("dataForm", { userData })
        
    } catch (error) {
        console.log(error)
    }
})


app.post("/insertData", UserModel.imageUpload , async (req, res) => {
    console.log(req.file)

    try {

        if(req.file){
            req.body.image = UserModel.imagePath + "/" + req.file.filename ;
        }
        await UserModel.create(req.body);
        console.log("Data inserted successfully");
    } catch (error) {
        console.log(error)
    }

    res.redirect("/")
})


app.get("/deleteData/:id", async (req, res) => {
    // console.log(req.params.id);
    try {
      const getDataUser = await UserModel.findById(req.params.id);
      console.log(getDataUser);
      if (getDataUser) {
        fs.unlinkSync(path.join(__dirname, getDataUser.image));
        
      }
      await UserModel.findByIdAndDelete(req.params.id);
      console.log("Data deleted successfully");
      res.redirect("back");
    } catch (err) {
      console.log(err);
    }
  });


  app.get("/editData/:id", async (req, res) => {
    const storeData = await UserModel.findById(req.params.id);
    console.log(storeData);
    res.render("editData", { storeData });
  });
  

  app.post("/updateData/:id", UserModel.imageUpload, async (req, res) => {
    console.log(req.params.id);
    console.log(req.body);
    console.log(req.file);
    try {
      if (req.file) {
        const getDataUser = await UserModel.findById(req.params.id);
        fs.unlinkSync(path.join(__dirname, getDataUser.image));
      }
      req.body.image = UserModel.imagePath + "/" + req.file.filename;
      await UserModel.findByIdAndUpdate(req.params.id, req.body);
      console.log("Data updated successfully");
      res.redirect("/");
    } catch (err) {
      console.log(err);
    }
  });
  


app.listen(PORT, (err) => {
    if (err) {
        console.log(err);
    }
    connection()
    console.log(`server run on ${PORT}`)
})