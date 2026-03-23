const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
    const allListing = await Listing.find({});
    res.render("index", { allListing });

};

module.exports.RenderNewForm = (req, res) => {
    res.render("new");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" }, }).populate({ path: "owner" });
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist");
        res.redirect("/listing");
    }
    console.log(listing);
    res.render("show", { listing });
};

module.exports.createListing = async (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;

    const newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id;
    newlisting.image = { url, filename };
    await newlisting.save();
    req.flash("success", " listing Created!");
    res.redirect("/listing");
};

module.exports.editListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
     if(!listing){
        req.flash("error", "Listing you requested for does not exist!");  
        return res.redirect("/listings");
    }
    let originalimageUrl = listing.image.url;
    originalimageUrl = originalimageUrl.replace("/upload", "/upload/h_250,w_250");
    res.render("edit", { listing, originalimageUrl });
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let newlisting = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if (typeof req.file !== "undefined");
    let url = req.file.path;
    let filename = req.file.filename;
    newlisting.image = { url, filename };
    await newlisting.save();
    req.flash("success", "Listing Updated!");
    res.redirect(`/listing/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listing");
};

