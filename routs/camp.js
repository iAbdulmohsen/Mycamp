var express = require("express");
const { Router } = require("express");
var router = express.Router();
var Camp = require("../models/campground"); // Camp name of the modle , this that function of moongoos use it
module.exports = router;

router.get("/campgrounds", function (req, res) {
  Camp.find(function (err, allCamp) {
    if (err) console.error(err);
    else {
      res.render("campgrounds/index", {
        campgrounds: allCamp,
      });
    }
  });
});

router.post("/campgrounds", isLoggedIn, function (req, res) {
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.desc;
  var city = req.body.city;
  var price = req.body.price;
  var vid = req.body.vid;
  var phone = req.body.phone;
  var loc = req.body.loc;
  var author = {
    id: req.user._id,
    username: req.user.username,
  };

  var newCampground = {
    name: name,
    image: image,
    desc: desc,
    author: author,
    city: city,
    price: price,
    vid: vid,
    phone: phone,
    loc: loc,
  };
  Camp.create(newCampground, function (err, newlyCreated) {
    if (err) console.error(err);
    else {
      res.redirect("/campgrounds");
    }
  });
});

router.get("/campgrounds/new", isLoggedIn, function (req, res) {
  res.render("campgrounds/new.ejs");
});

router.get("/campgrounds/:id", function (req, res) {
  // res.send("This will be the information page for the campgrounds one day ");
  //camp.FindById(id , function (callback))
  Camp.findById(req.params.id)
    .populate("comments")
    .exec(function (err, foundCampground) {
      if (err) console.error(err);
      else {
        console.log(foundCampground);
        res.render("campgrounds/show.ejs", { campgrounds: foundCampground });
      }
    });
});



//edit campground rout
router.get("/campgrounds/:id/edit", chickCampgrounOnwership, function (
  req,
  res
) {
  // res.render("campgrounds/edit" , {campground : foundCampground})

  // is user logged in ?
  if (req.isAuthenticated()) {
    Camp.findById(req.params.id)
      .populate("campgrounds")
      .exec(function (err, foundCampground) {
        res.render("campgrounds/edit.ejs", { campground: foundCampground });
      });
  } else {
    res.send("you have te be longged in ");
  }
});

router.put("/campgrounds/:id", chickCampgrounOnwership, function (req, res) {
  // find and update the correct camp
  var newData = {
    name: req.body.name,
    price: req.body.price,
    image: req.body.image,
    desc: req.body.desc,
    city: req.body.city,
    phone: req.body.phone,
    vid: req.body.vid,
    loc: req.body.loc,
  };
  Camp.findByIdAndUpdate(req.params.id, newData, function (
    err,
    foundCampground
  ) {
    if (err) {
      console.error(err);
      res.redirect("/campgrounds");
    } else {
      //redirect somewhere
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});
// delete campground rout

router.delete("/campgrounds/:id", chickCampgrounOnwership, function (req, res) {
  Camp.findByIdAndRemove(req.params.id, function (err, foundCampground) {
    if (err) {
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds");
    }
  });
});

function chickCampgrounOnwership(req, res, next) {
  // is user logged in ?
  if (req.isAuthenticated()) {
    Camp.findById(req.params.id)
      .populate("campgrounds")
      .exec(function (err, foundCampground) {
        if (err) {
          console.error(err);
          req.flash("error","Campground not found!")
          res.redirect("/campgrounds");
        } else {
          // is user own the campground ?
          if (foundCampground.author.id.equals(req.user._id)) {
            next();
          } else {
            req.flash("error", "You dont have prrmission to do that");
            res.redirect("back");
          }
        }
      });
  } else {
    req.flash("error" , "You have to be own this Campground")
    res.redirect("back");
  }
}

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "You need to be logged in to do That!");
  res.redirect("/login");
}
