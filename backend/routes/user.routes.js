import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  getUserProfile,
  startSession,
  updateUser,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/profile/:id", protectRoute, getUserProfile);
router.post("/startSession", protectRoute, startSession);
router.post("/update/:id", protectRoute, updateUser);

export default router;
