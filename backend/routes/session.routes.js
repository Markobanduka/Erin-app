import express from "express";

import {
  getAllSessions,
  getUserSessions,
} from "../controllers/session.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/all", protectRoute, getAllSessions);
router.get("/:id", protectRoute, getUserSessions);

export default router;
