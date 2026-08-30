import express from "express";

import { protect, authorize } from "../middleware/auth.js";

import {
  getLeaves,
  applyLeave,
  updateLeave
} from "../controllers/leaveController.js";

const router = express.Router();

router.get("/", protect, getLeaves);

router.post("/", protect, authorize("EMPLOYEE"), applyLeave);

router.put("/:id", protect, authorize("HR"), updateLeave);

export default router;