import express from "express";

import {
  getAllSessions,
  getMySessions,
  getUserSessions,
  startSession,
  updateSessionInfo,
} from "../controllers/session.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/", protectRoute, getMySessions);
router.get("/:id", protectRoute, getUserSessions);
router.post("/startSession", protectRoute, startSession);
router.post("/:id", protectRoute, updateSessionInfo);

export default router;
