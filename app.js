
if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
const ExpressError = require("./utils/ExpressError.js");
const { wrap } = require("module");
const session = require("express-session");
const { MongoStore } = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStategy = require("passport-local");
const User = require("./models/user.js")
const dns = require("dns");

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const dbURL = process.env.ATLASDB_URL;

async function main() {
    try {
        await mongoose.connect(dbURL);
        console.log("connected to DB");
    } catch (err) {
        console.log("error connecting to DB");
    }

}
main();
app.use(express.static('public'));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({
    mongoUrl: dbURL,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600
});
store.on("error", (err) => {
    console.log("ERROR in MONGO SESSION STORE", err)
});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        HttpOnly: true,
    },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});


app.get("/", (req, res) => {
    res.redirect("/listing");
});
app.use("/listing", listings);
app.use("/listings/:id/reviews", reviews);
app.use("/", userRouter);

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render("error.ejs", { err });
});

// app.listen(8080, () => {
//     console.log("server is listening to port 8080");
// });
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`server is listening on port ${PORT}`);
});
