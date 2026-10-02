const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const { listingSchema } = require('../scheme.js'); // Import the Joi schema
const ExpressError = require('../utils/ExpressError.js');
const Listing = require('../models/listing.js');
const { isLoggedIn , isOwner , validateListing } = require('../middleware.js'); // Import the isLoggedIn middleware
const listingController = require("../controllers/listings.js");
const multer = require('multer');    // db dont understand that form is sending file so to we have to use this pkg
const {storage} = require("../cloudConfig.js");
const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 },
});

// Router.route - a way to group together routes with diff verbs(get,post,delete) but same payh

router.route("/")
    //index route or Route to get all listings
    .get(wrapAsync(listingController.index) ) //res.render(). Express expects a relative path to the view file without the .ejs extension. 
    
    //create route
    .post(
        isLoggedIn ,
        upload.single('listing[image]'),
        validateListing ,
        wrapAsync( listingController.createlisting )
    );

//create new list
router.get('/new', isLoggedIn ,listingController.renderNewForm  );

router.route('/:id')
    // show route
    .get( wrapAsync(listingController.showlisting))

    //update route
    .put(isLoggedIn ,
        isOwner,
        upload.single("listing[image]"),
        validateListing ,
        wrapAsync(listingController.updatelisting)
    )

    //delete route
    .delete(
    isLoggedIn , 
    isOwner,
    wrapAsync(listingController.deletelisting)
    );


//edit route
router.get('/:id/edit',
    isLoggedIn , 
    isOwner,
    validateListing,
    wrapAsync(listingController.renderEditForm));

module.exports = router;