import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import Client from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  try {
    const { fullName, email, password, confirmedPassword } = req.body;
    if (!fullName || !email || !password || !confirmedPassword) {
      return res.status(400).json({ error: "Please fill all the fields" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmail = emailRegex.test(email);

    if (!isValidEmail) {
      return res
        .status(400)
        .json({ error: "Please enter a valid email address" });
    }

    const existingClient = await Client.findOne({ email });
    if (existingClient) {
      return res.status(400).json({ error: "User already exists" });
    }

    if (password !== confirmedPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters long" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newClient = new Client({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newClient) {
      generateTokenAndSetCookie(newClient._id, res);
      await newClient.save();
      return res.status(201).json({
        _id: newClient._id,
        fullName: newClient.fullName,
        email: newClient.email,
        sessionsLeft: newClient.sessionsLeft,
        sessionsHistory: newClient.sessionsHistory,
        profileImg: newClient.profileImg,
        isAdmin: newClient.isAdmin,
      });
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ error: "Internal server error: " + error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingClient = await Client.findOne({ email });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingClient?.password || ""
    );

    if (!existingClient || !isPasswordCorrect) {
      return res.status(400).json({ error: "Wrong email or password!" });
    }

    generateTokenAndSetCookie(existingClient._id, res);
    return res.status(200).json({
      _id: existingClient._id,
      fullName: existingClient.fullName,
      email: existingClient.email,
      sessionsLeft: existingClient.sessionsLeft,
      sessionsHistory: existingClient.sessionsHistory,
      profileImg: existingClient.profileImg,
      isAdmin: existingClient.isAdmin,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ error: "Internal server error: " + error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ error: "Internal server error: " + error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await Client.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.log("Error in getMe controller", error.message);
    res.status(500).json({ error: "Internal server error: " + error.message });
  }
};
