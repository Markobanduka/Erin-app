import express from "express";

import {
  getAllSessions,
  getMySessions,
  getUserSessions,
  startSession,
} from "../controllers/session.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

// ? ?
router.get("/all", protectRoute, getAllSessions);
// ? ?
router.get("/", protectRoute, getMySessions); // for client
router.get("/:id", protectRoute, getUserSessions); // for admin
router.post("/startSession", protectRoute, startSession);

export default router;
