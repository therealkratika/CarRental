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
    isForSale: { type: Boolean, default: true },
    isForRent: { type: Boolean, default: false },

    salePrice: Number,
    rentPricePerDay: Number,
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    contact: {
      name: String,
      phone: String,
      email: String,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number], 
      },
      city: String,
      area: String,
    },
    status: {
      type: String,
      enum: ["available", "sold", "rented"],
      default: "available",
    },
      rating: { type: Number, default: 0 },
      ratings:[
        {
          user:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
          value: {
            type: Number,
            min: 1,
            max: 5,
          }
        }
      ]
  },
  { timestamps: true }
);
bookSchema.index({ location: "2dsphere" });

export default mongoose.model("Book", bookSchema);