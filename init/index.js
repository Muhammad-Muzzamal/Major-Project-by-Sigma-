const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listings.model.js");
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

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({ ...obj, owner: "6957da674534a4defdcd0923" }));
  await Listing.insertMany(initData.data);
  console.log("Data was initialized");
};

initDB();
