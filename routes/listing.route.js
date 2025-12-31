const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listings.model");
const Review = require("../models/review.model.js");

const router = express.Router();

// index route
router.get("/", async (req, res) => {
  const allListing = await Listing.find({});
  return res.render("listings/index.ejs", { allListing });
});

// Show route
router.get("/new", (req, res) => {
  res.render("listings/new.ejs");
});
// Show route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    return res.render("listings/show.ejs", { listing });
  })
);
// Create Listing route
router.post(
  "/",
  wrapAsync(async (req, res) => {
    // console.log(req.body);
    // if (!req.body.listings) {
    //   console.log(req.body);
    //   throw new ExpressError(400, "Send valid data for listing");
    // }
    const { title, description, location, image, price } = req.body;
    let listData = { title, description, location, image, price };
    await Listing.insertOne(listData);
    res.redirect("/listings");
  })
);
// Show Edit Form Route
router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  })
);
// Edit Listing
router.post(
  "/:id",
  wrapAsync(async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description, location, price, image } = req.body;
      const listData = { title, description, location, price, image };
      await Listing.findByIdAndUpdate(id, listData);
      res.redirect("/listings");
    } catch (err) {
      next(err);
    }
  })
);
// Delete Listing
router.delete(
  "/:id/delete",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  })
);

module.exports = router;
