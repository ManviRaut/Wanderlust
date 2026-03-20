const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controller/users.js");


router.get("/signup", userController.userget);

router.post("/signup", wrapAsync(userController.userPost));

router.get("/login", userController.userLogin)

router.post("/login", saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true, }),
    userController.userSave
);

router.get("/logout", userController.userLogout);

module.exports = router;