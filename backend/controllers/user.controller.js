import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import Session from "../models/session.model.js";

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
  let { fullName, email, currentPassword, newPassword, bio, sessionsLeft } =
    req.body;
  const { id } = req.params;
  const authUser = req.user._id.toString();
  const isAdmin = req.user.isAdmin;

  const existingEmail = await User.findOne({ email });

  if (existingEmail === email) {
    return res.status(400).json({ error: "Email already exists" });
  }

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

    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.bio = bio || user.bio;
    user.sessionsLeft = sessionsLeft || user.sessionsLeft;

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

    await Session.deleteMany({ user: id });
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.log("Error in deleteUser controller: " + error.message);
    res.status(500).json({ error: "Internal server error " + error.message });
  }
};
