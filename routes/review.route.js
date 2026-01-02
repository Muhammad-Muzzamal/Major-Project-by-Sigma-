const express = require("express");
const Listing = require("../models/listings.model");
const Review = require("../models/review.model.js");

const router = express.Router({ mergeParams: true });

// Reviews
// post route
router.post("/", async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  let newReview = new Review(req.body.review);
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  req.flash("success", "Review Created Successfully");
  return res.redirect(`/listings/${id}`);
});
// delete route
router.post("/:reviewId", async (req, res) => {
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { review: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review Deleted Successfully");
  res.redirect(`/listings/${id}`);
});

module.exports = router;
