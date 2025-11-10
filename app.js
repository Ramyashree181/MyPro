if(process.env.NODE_ENV != "production") {
    require("dotenv").config();
}
const express = require('express');
const app = express();

const summarizeRoute = require('./routes/summarize');


const mongoose = require('mongoose');
const ejs = require('ejs');
const Listing = require('./models/listing.js');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError.js');
// configure EJS and layout engine
app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');
const multer = require('multer');    // db dont understand that form is sending file so to we have to use this pkg
const upload = multer({dest : "uploads/"});

const userRouter = require('./routes/user.js');
const listingRouter = require('./routes/listing.js');
const reviewRouter = require('./routes/review.js');

// Database connection
main().then(() => {
    console.log('Database connection successful');
}).catch(err => {
    console.error('Database connection error:', err);
});

async function main() {
    await mongoose.connect('mongodb://localhost:27017/wonderLust');
}

// Static files, body parsing and method override (mounted before routers)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // ✅ This enables JSON parsing for POST requests
app.use(methodOverride('_method'));

const sessionOptions = {
    secret : "mysupersecretkey",
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true,
    },
};

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.use(session(sessionOptions));
app.use(flash()); //flash is used after session and before routes 52 53

 //passport is used after session
app.use(passport.initialize());  //a MW that initializes passport
app.use(passport.session()); // a webapplication needs the ability to identify users as they interact with the app across multiple requests
passport.use(new LocalStrategy(User.authenticate())); //tells passport to use local strategy for authentication using username and password
passport.serializeUser(User.serializeUser()); //how to store a user in the session
passport.deserializeUser(User.deserializeUser()); //how to delete or remove a user from the session

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user; //to access the current logged in user in all ejs files
    next();
});

//demo user route to create a user
app.get("/demouser" , async (req, res) => {
    const fakeUser = new User({
        email:"abcd@gmail.com",
        username:"abcd"
    });
    let registeredUser = await User.register(fakeUser , "abcd1234" )
    res.send(registeredUser);
});
    
app.use('/listings', listingRouter); // Use the listings routes
app.use('/listings/:id/reviews', reviewRouter); // Use the reviews routes
app.use('/', userRouter); // Use the user routes 


app.use(summarizeRoute); 

app.use((req, res, next) => {
  next(new ExpressError(404, 'Page Not Found'));
});

// Error handling middleware
app.use((err, req, res, next) => { 
    let { statuscode = 500, message = 'Something went wrong' } = err;
    res.status(statuscode).render("listings/error", {err});
    // res.status(statuscode).send(message);
});

// Start the server
app.listen(8080, () => {
    console.log('Server is running on port 8080');
});
