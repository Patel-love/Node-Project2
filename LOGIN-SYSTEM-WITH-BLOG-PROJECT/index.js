const express =require("express");
const dashbordrouter = require("./router/dashboard");
const connection = require("./cofig/db");
var cookieParser = require('cookie-parser')
var session = require('express-session')
const passport = require("passport");
const path =require("path")
const app=express();
let port = 3333;
const passportLocal=require("./cofig/passport-local")
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));


app.set("view engine", "ejs");
app.use("/assets",express.static(path.join(__dirname,"/assets")))

app.use(express.urlencoded());
app.use(cookieParser())
app.use(session({
  secret: 'our-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {maxAge:100*60*60}
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setUser);
app.use("/",dashbordrouter);

app.listen(port,(error)=>{
    if (error) {
        console.log(error);
        return;
      }
      connection();
      console.log("server is running on port",port);
});