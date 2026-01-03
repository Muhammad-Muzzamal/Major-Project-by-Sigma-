const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listings.model");
const Review = require("../models/review.model.js");
const { isLoggedIn } = require("../middleware.js");

const router = express.Router();

// index route
router.get("/", async (req, res) => {
  const allListing = await Listing.find({});
  return res.render("listings/index.ejs", { allListing });
});

// Show route (create new)
router.get("/new", isLoggedIn, (req, res) => {
  res.render("listings/new.ejs");
});
// Show route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
      .populate("reviews")
      .populate("owner");
    if (!listing) {
      req.flash("error", "Listing you requested for does not exist");
      return res.redirect("/listings");
    }
    // console.log(listing);
    return res.render("listings/show.ejs", { listing });
  })
);
// Create Listing route
router.post(
  "/",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    // console.log(req.body);
    // if (!req.body.listings) {
    //   console.log(req.body);
    //   throw new ExpressError(400, "Send valid data for listing");
    // }
    const { title, description, location, image, price } = req.body;
    let listData = { title, description, location, image, price };
    listData.owner = req.user._id;
    await Listing.insertOne(listData);
    req.flash("success", "New listing created!");
    res.redirect("/listings");
  })
);
// Show Edit Form Route
router.get(
  "/:id/edit",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing you requested for does not exist");
      return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
  })
);
// Edit Listing
router.post(
  "/:id",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description, location, price, image } = req.body;
      const listData = { title, description, location, price, image };
      await Listing.findByIdAndUpdate(id, listData);
      req.flash("success", "Listing updated successfully");
      res.redirect("/listings");
    } catch (err) {
      next(err);
    }
  })
);
// Delete Listing
router.delete(
  "/:id/delete",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted Successfully!");
    res.redirect("/listings");
  })
);

module.exports = router;
