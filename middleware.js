const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError.js");
const { ListingSchema, ReviewSchema } = require("./schema.js")

module.exports.isloggedin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must log in to create listing");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "you are not the owner of the listing");
        return res.redirect(`/listing/${id}`);
    }
    next();
};
module.exports.validateListing = (req, res, next) => {
    const { error } = ListingSchema.validate(req.body);
    if (error) {
        let errmsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errmsg);
    } else {
        next();
    }
};


module.exports.validateReview = (req, res, next) => {
    const { error } = ReviewSchema.validate(req.body);
    console.log(req.body);
    if (error) {

        let errmsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errmsg);
    } else {
        next();
    }
};

module.exports.isReviewauthor = async (req, res, next) => {
    let { id, reviewID } = req.params;
    let review = await Review.findById(reviewID);
    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "you did not create this review");
        return res.redirect(`/listing/${id}`);
    }
    next();
};