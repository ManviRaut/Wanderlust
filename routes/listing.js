const express = require("express");
const router = express();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { isloggedin, isOwner, validateListing } = require("../middleware.js")
const listingController = require("../controller/listing.js");
const multer = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });


router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isloggedin, upload.single('listing[image]'), validateListing, wrapAsync(listingController.createListing));

//New Route
router.get("/newForm", isloggedin, listingController.RenderNewForm);
//search route
router.get("/search", async (req, res) => {
    const query = req.query.q;

    const listings = await Listing.find({
        $or: [
            {
                title: {
                    $regex: query,
                    $options: "i",
                },
            },
            {
                location: {
                    $regex: query,
                    $options: "i",
                },
            },
            {
                country: {
                    $regex: query,
                    $options: "i",
                },
            },
        ],
    });

    res.render("index.ejs", { allListing: listings });
});
//Edit route
router.get("/:id/edit", isloggedin, isOwner, wrapAsync(listingController.editListing));
router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isloggedin, isOwner, upload.single('listing[image]'),validateListing, wrapAsync(listingController.updateListing))
    .delete(isloggedin, isOwner, upload.single('listing[image]'), wrapAsync(listingController.destroyListing));


module.exports = router;
