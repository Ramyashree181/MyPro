const User = require('../models/user.js');

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup");
}

module.exports.signup = async (req, res) => {
  try{
    let { username, email , password } = req.body;
    const newUser = new User({ username, email });
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser , (err) => {  //user should automatically login after signing up
        if(err) {
          return next(err);
        }
        req.flash("success", "Welcome to WonderLust!");
        res.redirect("/listings");  
    });
  }catch(e){
    req.flash("error", e.message);
    res.redirect("/signup");
  }
}

module.exports.renderLoginForm =  (req, res) => {
    res.render("users/login.ejs");
}

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back!");
    res.redirect(res.locals.redirectUrl || "/listings"); //mw.js is not triggered if you click login buttom directly from listings page
}

module.exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "Logged you out!");
        res.redirect("/listings");
    })
}