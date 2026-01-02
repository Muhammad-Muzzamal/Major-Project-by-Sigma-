const express = require("express");
const router = express.Router();
const User = require("../models/user.model.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");

router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});
router.post(
  "/signup",
  wrapAsync(async (req, res) => {
    try {
      let { username, password, email } = req.body;
      const newUser = new User({ email, username });
      const registeredUser = await User.register(newUser, password);
      req.login(registeredUser, (err) => {
        if (err) {
          next(err);
        }
        req.flash("success", "Wellcome to Wonderlust");
        res.redirect("/listings");
      });
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("/signup");
    }
  })
);
router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (req, res) => {
    console.log("i am from user login");
    req.flash("success", "Welcome to WonderLust");
    res.redirect("/listings");
  }
);
router.get("/logout", (req, res) => {
  req.logout((error) => {
    if (error) {
      next(error);
    }
    req.flash("success", "You are logged out!");
    res.redirect("/listings");
  });
});
module.exports = router;
