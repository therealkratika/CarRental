import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  description: String,
  category: String,
  condition: String,

  isForSale: Boolean,
  isForRent: Boolean,

  salePrice: Number,
  rentPricePerDay: Number,

  image: String,

  // ✅ GEO LOCATION
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number], // [lng, lat]
    },
    city: String,
    area: String,
  },

  contact: {
    name: String,
    phone: String,
    email: String,
  },

  status: {
    type: String,
    default: "available",
  },

  rentedForDays: Number,

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

bookSchema.index({ location: "2dsphere" });

export default mongoose.model("Book", bookSchema);