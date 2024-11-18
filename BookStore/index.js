const express = require("express");
const app = express();
const connection = require("./config/db");
const UserModel = require("./model/model");
const port = 9000;

app.set("view engine", "ejs");

app.use(express.urlencoded());

// Home route to display book data
app.get("/", async (req, res) => {
    const bookData = await UserModel.find({});
    res.render("add", { bookData });
});

// Add new book
app.post("/bookadd", async (req, res) => {
    await UserModel.create(req.body);
    res.redirect("back");
});

// Delete book by ID
app.get("/deletebook/:id", async (req, res) => {
    await UserModel.findByIdAndDelete(req.params.id);
    console.log("Data deleted successfully");
    res.redirect("back");
});

// Update book (fetching data for edit)
app.get("/update/:id", async (req, res) => {
    const storeData = await UserModel.findById(req.params.id);
    res.render("update", { storeData });
});

// Save edited book
app.post("/editData/:id", async (req, res) => {
    try {
        await UserModel.findByIdAndUpdate(req.params.id, req.body);
        console.log("Data updated successfully");
        res.redirect("/");
    } catch (err) {
        console.log(err);
    }
});

app.listen(port, (error) => {
    if (error) {
        console.log("Server is not running");
        return;
    }
    connection();
    console.log(`Server is running on port : ${port}`);
});
