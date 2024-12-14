const passport = require("passport");
const userModel = require("../model/usermodel");
const PassportStretrgy = require("passport-local").Strategy;


passport.use(new PassportStretrgy({ usernameField:'username' },async(username, password, done) => {
    console.log(username ,password);
    const getUserData = await userModel.findOne({ username: username });
    if (getUserData) {
        if (getUserData.password === password) {
           return done(null, getUserData);
        } else {
           return done(null, false);
        }
    } else {
       return done(null, false);
    }
}));

passport.serializeUser(async (user , done)=> {
  
    const userData = await userModel.findById(user.id);
    if(userData){
       return done(null , userData.id);
    }else{
        done(null , false);
    }
})
passport.deserializeUser(async (id , done)=> {
   

    const userData = await userModel.findById(id);
    if(userData){
       return done(null , userData);
    }else{
       return done(null , false);
    }
});

passport.isAuth = (req, res, next) => {
   console.log(req.isAuthenticated());
   if (req.isAuthenticated()) {
     next();
   } else {
     res.redirect("/");
   }
 };

 passport.setUser = (req, res, next) => {
   res.locals.user = req.user;   
   next();
 };

module.exports = passport;