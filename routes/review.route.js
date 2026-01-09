const express = require("express");
const { isLoggedIn, isAuthor } = require("../middleware.js");
const {
  storeReview,
  deleteReview,
} = require("../controllers/review.controller.js");

const router = express.Router({ mergeParams: true });

router.post("/", isLoggedIn, storeReview);
router.post("/:reviewId", isLoggedIn, isAuthor, deleteReview);

module.exports = router;
