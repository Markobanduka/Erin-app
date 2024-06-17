import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";

export const getUserProfile = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    console.log("Error in getUserProfile: " + error.message);
    res.status(500).json({ error: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  const loggedInUserId = req.user._id;
  const isAdmin = req.user.isAdmin;
  try {
    if (isAdmin) {
      const users = await User.find()
        .sort({ updatedAt: -1 })
        .select("-password");

      const filteredUsers = users.filter(
        (user) => user._id.toString() !== loggedInUserId.toString()
      );

      return res.status(200).json(filteredUsers);
    } else {
      return res.status(401).json({ error: "Unauthorized" });
    }
  } catch (error) {
    console.log("Error in getAllUsers: " + error.message);
    res.status(500).json({ error: "ISE " + error.message });
  }
};

export const updateUser = async (req, res) => {
  let { fullName, email, currentPassword, newPassword } = req.body;
  let { profileImg, coverImg } = req.body;
  const { id } = req.params;
  const authUser = req.user._id.toString();
  const isAdmin = req.user.isAdmin;
  try {
    if (isAdmin) {
      if (!id) return res.status(400).json({ error: "User id not found" });
    } else {
      if (id !== authUser)
        return res.status(401).json({ error: "Unauthorized" });
    }
    let user = await User.findById(id);
    if (!user) return res.status(404).json({ error: "User not found" });

    if ((!newPassword && currentPassword) || (!currentPassword && newPassword))
      return res.status(400).json({
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

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  const isAdmin = req.user.isAdmin;
  try {
    if (isAdmin) {
      if (!id) return res.status(400).json({ error: "User id not found" });
    } else {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.img) {
      const imgId = user.img.split("/").pop().slice(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }

    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.log("Error in deleteUser controller: " + error.message);
    res.status(500).json({ error: "Internal server error " + error.message });
  }
};
