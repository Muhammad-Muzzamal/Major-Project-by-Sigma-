const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const Listing = require("./models/listings.model");
const path = require("path");

const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));

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
app.get("/listings", async (req, res) => {
  const allListing = await Listing.find({});
  return res.render("listings/index.ejs", { allListing });
});
// Show route
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  return res.render("listings/show.ejs", { listing });
});

// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "test Title",
//     description: "text description",
//     price: 1200,
//     location: "Karachi",
//     country: "Pakistan",
//   });
//   await sampleListing.save();
//   console.log("Sample Listign was saved");
//   res.send("successfull");
// });

app.listen(8080, () => {
  console.log(`App is listen on http://localhost:8080`);
});
