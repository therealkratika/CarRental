import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    author: {
      type: String,
      required: true,
    },

    description: String,

    images: [
      {
        type: String, // Cloudinary URLs
      },
    ],

    category: {
      type: String,
      enum: ["academic", "fiction", "non-fiction", "other"],
      default: "other",
    },

    condition: {
      type: String,
      enum: ["new", "good", "old"],
      default: "good",
    },

    // 🔥 BOTH rent & sell supported
    isForSale: {
      type: Boolean,
      default: false,
    },

    isForRent: {
      type: Boolean,
      default: false,
    },

    salePrice: {
      type: Number,
    },

    rentPricePerDay: {
      type: Number,
    },

    // Availability tracking
    status: {
      type: String,
      enum: ["available", "sold", "rented"],
      default: "available",
    },

    // 📍 GEO LOCATION (IMPORTANT 🔥)
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], 
        required: true,
      },
      city: String,
      area: String,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);
bookSchema.index({ location: "2dsphere" });

export default mongoose.model("Book", bookSchema);