const mongoose = require("mongoose");
const { ListingSchema } = require("../schema");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description:{type: String},
    image: {
        url: String,
        filename: String,
    },
    price: {type:Number},
    location: {type:String},
    country:{type: String},
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review",
    }],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },

});

listingSchema.post("findOneAndDelete", async (listing) => {
    await Review, this.deleteMany({ _id: { $in: listing.review } });
})

const listing = mongoose.model("Listing", listingSchema);
module.exports = listing;
