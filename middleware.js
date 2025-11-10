const Listing = require('./models/listing');
const Review = require('./models/review');
const { listingSchema } = require('./scheme.js'); // Import the Joi schema
const ExpressError = require('./utils/ExpressError.js');
const {  reviewSchema} = require('./scheme.js'); 

module.exports.isLoggedIn = (req, res, next) => {

    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl; //to store the url user wanted to access before login after login redirect to that url
        req.flash('error', 'You must be logged in to access that page.');
        return res.redirect('/login');
    }next();
} 

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    let listing = await Listing.findById(id);
    if(res.locals.currentUser && !listing.owner._id.equals(res.locals.currentUser._id)){
        req.flash('error', 'You are not the owner of this listing!');
        return res.redirect(`/listings/${id}`);
    
    } 
    next();
}

module.exports.validateListing = (req, res, next) => {
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map(el=>el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map(el=>el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    } 
};

module.exports.isReviewAuthor = async (req, res, next) => {
    const {id ,reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if(res.locals.currentUser && !review.author._id.equals(res.locals.currentUser._id)){
        req.flash('error', 'You are not the author of this review!');
        return res.redirect(`/listings/${id}`);
    } 
    next();
};