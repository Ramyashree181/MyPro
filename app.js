if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
const express = require('express');
const app = express();

const summarizeRoute = require('./routes/summarize');


const mongoose = require('mongoose');
const { MongoStore } = require('connect-mongo');
const ejs = require('ejs');
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

const userRouter = require('./routes/user.js');
const listingRouter = require('./routes/listing.js');
const reviewRouter = require('./routes/review.js');

const isProduction = process.env.NODE_ENV === 'production';
const mongoUri = process.env.MONGODB_URI || (isProduction ? undefined : 'mongodb://localhost:27017/wonderLust');
const sessionSecret = process.env.SESSION_SECRET || (isProduction ? undefined : 'local-development-secret');
const port = Number(process.env.PORT) || 8080;

if (!mongoUri) {
    throw new Error('MONGODB_URI must be set in production.');
}
if (!sessionSecret) {
    throw new Error('SESSION_SECRET must be set in production.');
}

// Static files, body parsing and method override (mounted before routers)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // ✅ This enables JSON parsing for POST requests
app.use(methodOverride('_method'));

if (isProduction) {
    app.set('trust proxy', 1);
}

const sessionOptions = {
    secret: sessionSecret,
    store: MongoStore.create({
        mongoUrl: mongoUri,
        collectionName: 'sessions',
    }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
    },
};

app.get('/', (req, res) => {
    res.redirect('/listings');
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

async function startServer() {
    await mongoose.connect(mongoUri);
    console.log('Database connection successful');
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

startServer().catch(err => {
    console.error('Application startup failed:', err);
    process.exit(1);
});
