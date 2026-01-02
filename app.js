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
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const user = require("./models/user.model.js");
const UserRoutes = require("./routes/user.route.js");

const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
app.use(cookieParser());
app.use(flash());

const sessionOptions = {
  secret: "secret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(user.authenticate()));

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

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

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/listings", ListingRoutes);
app.use("/listings/:id/reviews", ReviewRoutes);
app.use("/", UserRoutes);

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
