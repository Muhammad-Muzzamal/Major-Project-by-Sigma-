const express = require("express");
const Listing = require("../models/listings.model");
const Review = require("../models/review.model.js");
const { isLoggedIn, isAuthor } = require("../middleware.js");

const router = express.Router({ mergeParams: true });

// Reviews
// post route
router.post("/", isLoggedIn, async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  listing.reviews.push(newReview);
  console.log(newReview);
  await newReview.save();
  await listing.save();
  req.flash("success", "Review Created Successfully");
  return res.redirect(`/listings/${id}`);
});
// delete route
router.post("/:reviewId", isLoggedIn, isAuthor, async (req, res) => {
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { review: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review Deleted Successfully");
  res.redirect(`/listings/${id}`);
});

module.exports = router;
