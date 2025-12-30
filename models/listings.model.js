const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    require: true,
  },
  description: String,
  image: {
    type: String,
    default:
      "https://www.freepik.com/free-vector/gradient-beach-sunset-landscape_4566226.htm#fromView=keyword&page=1&position=0&uuid=297de3a3-d84b-41b2-a047-a6e0bebea988&query=Sunset",
    set: (v) =>
      v === ""
        ? "https://www.freepik.com/free-vector/gradient-beach-sunset-landscape_4566226.htm#fromView=keyword&page=1&position=0&uuid=297de3a3-d84b-41b2-a047-a6e0bebea988&query=Sunset"
        : v,
  },
  price: Number,
  location: String,
  country: String,
  reviews : [
    {
      type : Schema.Types.ObjectId,
      ref : "Review"
    }
  ]
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
