var express = require("express");
var router = express.Router({ mergeParams: true });
var comment = require("../models/comment");
var Camp = require("../models/campground");
module.exports = router;

router.get("/campgrounds/:id/comments/new", isLoggedIn, function (req, res) {
  // show form to creat new comment
  //find campground by id
  Camp.findById(req.params.id, function (err, campground) {
    if (err) console.log(err);
    else {
      res.render("commetns/new", { campground: campground });
    }
  });
});

router.post("/campgrounds/:id/comments", isLoggedIn, function (req, res) {
  Camp.findById(req.params.id, function (err, campground) {
    if (err) {
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      comment.create(req.body.comment, function (err, comment) {
        if (err) {
          req.flash("error", "something went wrong");

          console.log(err);
        } else {
          //add username and id
          // req.user
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          // save
          comment.save();
          campground.comments.push(comment);
          campground.save();
          req.flash("success", "successfully added comment!");
          res.redirect("/campgrounds/" + campground._id);
        }
      });
    }
  });
});

//edit comments
router.get(
  "/campgrounds/:id/comments/:comment_id/edit",
  chickCommentship,
  function (req, res) {
    comment.findById(req.params.comment_id, function (err, founComment) {
      if (err) {
        res.redirect("back");
      } else {
        res.render("commetns/editComment", {
          campground_id: req.params.id,
          comment: founComment,
        });
      }
    });
  }
);

router.put("/campgrounds/:id/comments/:comment_id", function (req, res) {
  var newData = {
    text: req.body.text,
  };

  comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (
    err,
    updatedComment
  ) {
    if (err) res.redirect("back");
    else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

//Delete comment
router.delete(
  "/campgrounds/:id/comments/:comment_id",
  chickCommentship,
  function (req, res) {
    // res.send("hit button of delete comment")
    comment.findByIdAndRemove(req.params.comment_id, function (err, dcomment) {
      if (err) res.redirect("back");
      else {
        req.flash("success", "successfuly Deleted comeent!");
        res.redirect("/campgrounds/" + req.params.id);
      }
    });
  }
);

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "Please Login First!");
  res.redirect("/login");
}

function chickCommentship(req, res, next) {
  // is user logged in ?
  if (req.isAuthenticated()) {
    comment
      .findById(req.params.comment_id)
      .populate("campgrounds")
      .exec(function (err, foundComment) {
        if (err) {
          console.error(err);
          res.redirect("/campgrounds");
        } else {
          // is user own the campground ?
          if (foundComment.author.id.equals(req.user._id)) {
            next();
          } else {
            req.flash("error", "you don't have permeission to do that");

            res.redirect("back");
          }
        }
      });
  } else {
    req.flash("error", "You need to be logged in to do That!");
    res.redirect("back");
  }
}
