const User = require("../models/user");


module.exports.userget = (req, res) => {
    res.render("users/signup");
};

module.exports.userPost = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registerUser = await User.register(newUser, password);
        console.log(registerUser);
        req.login(registerUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust");
            res.redirect("/listing");
        })
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.userLogin = (req, res) => {
    res.render("users/login");
};

module.exports.userSave = async (req, res) => {
    req.flash("success", "Welcome to wanderlust!");
    let redirectUrl = res.locals.redirectUrl || "/listing";
    res.redirect(redirectUrl);
};


module.exports.userLogout = (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "you are logged out");
        res.redirect("/listing");
    });
};