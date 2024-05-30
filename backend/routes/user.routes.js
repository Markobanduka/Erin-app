import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  getUserProfile,
  startSession,
  updateUser,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/profile/:email", protectRoute, getUserProfile);
router.post("/startSession", protectRoute, startSession);
router.post("/update", protectRoute, updateUser);

export default router;
