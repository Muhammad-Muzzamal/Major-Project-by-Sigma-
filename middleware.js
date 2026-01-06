const Listing = require("./models/listings.model.js");
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be login for create new listing.");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  console.log(" middlware : ", req);
  if (listing.owner.equals(req.local.currUser._id)) {
    req.flash("error", "You dont have permission to edit");
    return req.redirect(`/listing/${id}`);
  }
  next();
};

module.exports.isAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Listing.findById(id);
  if (review.author.equals(req.locals.currUser._id)) {
    req.flash("error", "You dont have permission to delete");
    return req.redirect(`/listing/${id}`);
  }
  next();
};
