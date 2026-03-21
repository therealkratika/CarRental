import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    username: {
      type: String,
      required: true,
    },

    isOwner: {
      type: Boolean,
      default: false, // becomes true when user adds a car
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);