import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },

    description: String,
    category: String,

    condition: {
      type: String,
      enum: ["New", "Like New", "Good", "Fair"],
      default: "Good",
    },

    image: String,

    // SELL / RENT
    isForSale: { type: Boolean, default: true },
    isForRent: { type: Boolean, default: false },

    salePrice: Number,
    rentPricePerDay: Number,

    // OWNER
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // CONTACT (for nearby)
    contact: {
      name: String,
      phone: String,
      email: String,
    },

    // LOCATION (GeoJSON)
    location: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number], // [lng, lat]
      },
      city: String,
      area: String,
    },

    // STATUS
    status: {
      type: String,
      enum: ["available", "sold", "rented"],
      default: "available",
    },
  },
  { timestamps: true }
);

// 🔥 IMPORTANT for nearby
bookSchema.index({ location: "2dsphere" });

export default mongoose.model("Book", bookSchema);