import mongoose from "mongoose";

// Define a sub-schema for the session history
const sessionHistorySchema = new mongoose.Schema(
  {
    sessionStart: {
      type: Date,
      default: Date.now, // Automatically sets the timestamp when the session is created
    },
    // Add any other fields related to the session if needed
  },
  { _id: false } // Prevents MongoDB from creating an _id field for each session entry
);

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
    },
    sessionsLeft: {
      type: Number,
      default: 0,
      min: 0,
    },
    sessionsHistory: {
      type: [sessionHistorySchema],
      default: [],
    },
    profileImg: {
      type: String,
      default: "",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
