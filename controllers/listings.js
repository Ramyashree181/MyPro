const Listing = require('../models/listing.js');

module.exports.index=async (req, res) => {
    const alllistings = await Listing.find({});
    res.render("listings/index", {alllistings });
}

module.exports.renderNewForm = (req, res) => {
    res.render('listings/new');
}

module.exports.showlisting = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({path: 'reviews',
        populate: { 
            path: 'author'
         },
    })
    .populate('owner');
    if (!listing) { 
    //  if the listing you trying to access is already deleted
        req.flash('error', 'Listing you requested for does not exist!');
        return res.redirect('/listings');
    }
    res.render('listings/show', { listing });
}

module.exports.createlisting = async (req, res) => {
        let url=req.file.path;
        let filename=req.file.filename;
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id; // Assign the logged-in user as the owner
        newListing.image = {url , filename};
        await newListing.save();
        req.flash('success', 'New Listing Created!');
        res.redirect("/listings");
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) { 
    //  if the listing you trying to access is already deleted
        req.flash('error', 'Listing you requested for does not exist!');
        return res.redirect('/listings');
    }
    //decreasing image quality
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload" , "/upload/,w_250");
    res.render('listings/edit', { listing , originalImageUrl});
};

module.exports.updatelisting = async (req, res) => {
    const { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing} , { runValidators: true, new: true });
    
    if(typeof req.file != "undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image = {url , filename};
    await listing.save();
    }

    req.flash('success', 'Listing Updated!');
    res.redirect(`/listings/${id}`);
}

module.exports.deletelisting = async (req, res) => {
    const { id } = req.params;
    let deletedlisting = await Listing.findByIdAndDelete(id);
    console.log(deletedlisting);
    req.flash('success', 'Listing Deleted!');
    res.redirect('/listings');
}