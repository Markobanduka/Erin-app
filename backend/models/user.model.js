import mongoose from "mongoose";

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
      type: [
        {
          sessionStart: {
            type: Date,
            required: true,
          },
        },
      ],
      default: [],
    },
    profileImg: {
      type: String,
      default: "",
    },
    bio: {
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
