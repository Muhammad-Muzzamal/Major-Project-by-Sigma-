const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const Listing = require("./models/listings.model");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError.js");

const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then((result) => {
    console.log("Connected successfully");
  })
  .catch((err) => {
    console.log("Error : ", err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.get("/", (req, res) => {
  res.send("Hi, I am root");
});

// index route
app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    const allListing = await Listing.find({});
    return res.render("listings/index.ejs", { allListing });
  })
);
// Show route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});
// Show route
app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    return res.render("listings/show.ejs", { listing });
  })
);
// Create Listing route
app.post(
  "/listings",
  wrapAsync(async (req, res) => {
    const { title, description, location, image, price } = req.body;
    let listData = { title, description, location, image, price };
    await Listing.insertOne(listData);
    res.redirect("/listings");
  })
);

// Show Edit Form Route
app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  })
);
// Edit Listing
app.post(
  "/listings/:id",
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
app.delete(
  "/listings/:id/delete",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  })
);

// If no route is found from above then this is called for 404
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page is not found"));
});

// Error Handling middleware
app.use((er, req, res, next) => {
  let { statusCode, message } = err;

  res.status(statusCode).send(message);
});

app.listen(8080, () => {
  console.log(`App is listen on http://localhost:8080`);
});
