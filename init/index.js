const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");

const mongoose_URL = "mongodb://127.0.0.1:27017/wonderlust";

main().then(() => {
    console.log("connected to DB")
}).catch((err) => {
    console.log(err);
})
async function main() {
    await mongoose.connect(mongoose_URL);
};

const initDB = async () => {
    await Listing.deleteMany({});
    initdata.data = initdata.data.map((obj) => ({ ...obj, owner: "69b53f02e98e07cf5e76e4f5" }));
    await Listing.insertMany(initdata.data);
    console.log("data was initialize");
}
initDB();