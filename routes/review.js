const express = require("express");
const routes = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { validateReview, isloggedin, isReviewauthor } = require("../middleware.js");
const reviewCont = require("../controller/review.js");

//reviews
routes.post("/", isloggedin, validateReview, wrapAsync(reviewCont.createReview));

//delete review 
routes.delete("/:reviewID", isloggedin, isReviewauthor, wrapAsync(reviewCont.reviewDestroy));

module.exports = routes;
