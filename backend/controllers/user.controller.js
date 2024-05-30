import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";

export const getUserProfile = async (req, res) => {
  const { email } = req.params;

  try {
    const user = await User.findOne({ email }).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    console.log("Error in getUserProfile: " + error.message);
    res.status(500).json({ error: error.message });
  }
};

export const startSession = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);

    if (!currentUser) return res.status(404).json({ error: "User not found" });

    if (currentUser.sessionsLeft <= 0) {
      return res.status(400).json({ error: "No sessions left" });
    }

    const newSession = {
      sessionStart: new Date(),
    };

    currentUser.sessionsHistory.push(newSession);
    currentUser.sessionsLeft -= 1;
    await currentUser.save();

    res.status(200).json({ message: "Session started successfully" });
  } catch (error) {
    console.log("Error in starting session controller: " + error.message);
    res.status(500).json({ error: "Internal server error " + error.message });
  }
};

export const updateUser = async (req, res) => {
  const { fullName, email, currentPassword, newPassword } = req.body;
  let { profileImg, coverImg } = req.body;
  const userId = req.user._id;
  try {
    let user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    if ((!newPassword && currentPassword) || (!currentPassword && newPassword))
      return res
        .status(400)
        .json({
          error: "Please provide both current password and new password",
        });

    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch)
        return res.status(400).json({ error: "Current password is incorrect" });
      if (newPassword.length < 6) {
        return res
          .status(400)
          .json({ error: "Password must be at least 6 characters long" });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }
    if (profileImg) {
      if (user.profileImg) {
        await cloudinary.uploader.destroy(
          user.profileImg.split("/").pop().split(".")[0]
        );
      }

      const uploadedResponse = await cloudinary.uploader.upload(profileImg);
      profileImg = uploadedResponse.secure_url;
    }

    if (coverImg) {
      if (user.coverImg) {
        await cloudinary.uploader.destroy(
          user.coverImg.split("/").pop().split(".")[0]
        );
      }
      const uploadedResponse = await cloudinary.uploader.upload(coverImg);
      coverImg = uploadedResponse.secure_url;
    }

    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.profileImg = profileImg || user.profileImg;
    user.coverImg = coverImg || user.coverImg;

    user = await user.save();

    user.password = null;
    return res.status(200).json(user);
  } catch (error) {
    console.log("Error in updateUser controller: " + error.message);
    res.status(500).json({ error: "Internal server error " + error.message });
  }
};
