import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  getAllUsers,
  getUserProfile,
  updateUser,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/profile/:id", protectRoute, getUserProfile);
router.get("/admin", protectRoute, getAllUsers);

router.post("/update/:id", protectRoute, updateUser);

export default router;
