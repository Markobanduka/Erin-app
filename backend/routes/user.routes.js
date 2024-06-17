import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  deleteUser,
  getAllUsers,
  getUserProfile,
  updateUser,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/profile/:id", protectRoute, getUserProfile);
router.get("/admin", protectRoute, getAllUsers);
router.delete("/:id", protectRoute, deleteUser);

router.post("/update/:id", protectRoute, updateUser);

export default router;
