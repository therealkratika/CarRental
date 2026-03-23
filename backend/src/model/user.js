import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // 🔐 Firebase UID (IMPORTANT)
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    // 📞 Contact (very important for your app)
    phone: {
      type: String,
      default: "",
    },

    avatar: {
      type: String, // profile image (Firebase / Cloudinary)
      default: "",
    },

    // 📍 Default user location
    location: {
      city: {
        type: String,
        default: "",
      },
      area: {
        type: String,
        default: "",
      },
    },

    // ⭐ Ratings (future feature)
    rating: {
      type: Number,
      default: 0,
    },

    totalReviews: {
      type: Number,
      default: 0,
    },
    isSeller: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);