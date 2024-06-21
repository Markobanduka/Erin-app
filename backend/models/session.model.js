import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sessionStart: {
      type: Date,
      default: Date.now,
    },
    // sessionInfo: {
    //   type: String,
    //   default: "", // Add default empty string
    // },
  },
  { timestamps: true }
);

const Session = mongoose.model("Session", sessionSchema);

export default Session;
