const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner } = require("../middleware.js");
const {
  showListing,
  index,
  createListing,
  saveListing,
  editListing,
  updateListing,
  deleteListing,
} = require("../controllers/listing.controller.js");

const router = express.Router();

router.route("/").get(index).post(isLoggedIn, wrapAsync(saveListing));

// router;
router.get("/new", isLoggedIn, createListing);
router.get("/:id", wrapAsync(showListing));
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(editListing));
router.post("/:id", isLoggedIn, isOwner, wrapAsync(updateListing));
router.delete("/:id/delete", isLoggedIn, isOwner, wrapAsync(deleteListing));

module.exports = router;
