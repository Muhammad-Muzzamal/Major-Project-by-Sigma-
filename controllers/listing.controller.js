const Listing = require("../models/listings.model.js");

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist");
    return res.redirect("/listings");
  }
  // console.log(listing);
  return res.render("listings/show.ejs", { listing });
};
module.exports.index = async (req, res) => {
  const allListing = await Listing.find({});
  return res.render("listings/index.ejs", { allListing });
};
module.exports.createListing = (req, res) => {
  res.render("listings/new.ejs");
};
module.exports.saveListing = async (req, res) => {
  // console.log(req.body);
  // if (!req.body.listings) {
  //   console.log(req.body);
  //   throw new ExpressError(400, "Send valid data for listing");
  // }
  const { title, description, location, image, price } = req.body;
  let listData = { title, description, location, image, price };
  listData.owner = req.user._id;
  await Listing.create(listData);
  req.flash("success", "New listing created!");
  res.redirect("/listings");
};
module.exports.editListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist");
    return res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { listing });
};
module.exports.updateListing = async (req, res) => {
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
};
module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted Successfully!");
  res.redirect("/listings");
};
