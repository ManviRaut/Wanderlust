const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    const allListing = await Listing.find({});
  res.render("index", { allListing });
}; 

module.exports.RenderNewForm = (req, res) => {
    res.render("new");
};

 module.exports.searchListing=async(req,res)=>{
    let {q}=req.query;
    let allListings=await Listing.find({
        $or:[
            {
                title:{
                    $regex:q,
                    $options:"i"
                }
            },
            {
                location:{
                    $regex:q,
                    $options:"i"
                }
            }
        ]
    });
    res.render("listings/index.ejs",{allListings});
 }
module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" }, }).populate({ path: "owner" });
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist");
        return res.redirect("/listings");
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
    res.redirect("/listings");
};

module.exports.editListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
     if(!listing){
        req.flash("error", "Listing you requested for does not exist!");  
        return res.redirect("/listings");
    }
    let originalimageUrl = listing.image.url;
    originalimageUrl = originalimageUrl.replace("/upload", "/upload/h_300,w_250");
    res.render("edit", { listing, originalimageUrl });
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
   // Find the listing first
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    
    if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};

;

