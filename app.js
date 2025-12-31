const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const ListingRoutes = require("./routes/listing.route.js");
const ReviewRoutes = require("./routes/review.route.js");
const cookieParser = require("cookie-parser");


const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
app.use(cookieParser());

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

app.use("/listings", ListingRoutes);
app.use("/listings/:id/reviews", ReviewRoutes);

// If no route is found from above then this is called for 404
// app.all("*", (req, res, next) => {
//   next(new ExpressError(404, "Page is not found"));
// });

// Error Handling middleware
app.use((err, req, res, next) => {
  let { statusCode = 500, message } = err;

  // res.status(statusCode).send(message);
  res.render("error.ejs", { err });
});

app.listen(8080, () => {
  console.log(`App is listen on http://localhost:8080`);
});
