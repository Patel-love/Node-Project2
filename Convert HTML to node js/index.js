const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");

// Port Number
const PORT = 8080;

// In-memory storage for users and login session
let users = [];
let loggedInUser = null;

// Middleware for parsing form data
app.use(bodyParser.urlencoded({ extended: true }));

// Set EJS as view engine
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

// Home Page Route 
app.get("/", (req, res) => {
    if (loggedInUser) {
        res.render("home", { user: loggedInUser });
    } else {
        res.redirect("/login");
    }
});

// Login Page Route
app.get("/login", (req, res) => {
    res.render("login");
});

// Login Form Submission
app.post("/login", (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        loggedInUser = user;
        res.redirect("/");
    } else {
        res.send("Invalid credentials. <a href='/login'>Try again</a>");
    }
});

// Signup Page Route
app.get("/signup", (req, res) => {
    res.render("signup");
});

// Signup Form Submission
app.post("/signup", (req, res) => {
    const { name, email, password } = req.body;
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
        res.send("User already exists! <a href='/signup'>Try again</a>");
    } else {
        const newUser = { name, email, password };
        users.push(newUser);
        res.redirect("/");
    }
});

// Logout Route
app.get("/logout", (req, res) => {
    loggedInUser = null;
    res.redirect("/login");
});

// Server start
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
