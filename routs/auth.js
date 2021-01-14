var express = require("express");
var router = express.Router();
module.exports = router;
var user = require("../models/user");

var passport = require("passport"),
  localStrategy = require("passport-local"),
  passportLocalMongoose = require("passport-local-mongoose");
  
// auth roust ==========
//show sing up routs form
router.get("/register", function (req, res) {
  res.render("register");
});
// handling user sing up

router.post("/register", function (req, res) {
  req.body.username;
  req.body.password;

  user.register(
    new user({ username: req.body.username }),req.body.password,function (err, user) {
      if (err) {
        req.flash("error", err.message);
        return res.redirect("register");
      } else {
        passport.authenticate("local")(req, res, function () {
          // أهم شي --- local is the stratege
          req.flash("success", "Welcome to MyCamp  " + user.username);
          res.redirect("/campgrounds");
        });
      }
    }
  );
});

// login routes

router.get("/login", function (req, res) {
  res.render("login");
});
// handling log in logic

// passport.auth is caled middleware
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/campgrounds", // نجح الدخول تروح وين؟
    FailureRedirect: "/login", //فشل
  }),
  function (req, res) {}
);

router.get("/logout", function (req, res) {
  req.logout();
  req.flash("success" , "logged you out !")
  res.redirect("/campgrounds");
});


function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error" ,"Please Login First!")
  res.redirect("login");
}