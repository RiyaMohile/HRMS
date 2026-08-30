import express from "express";

import { protect, authorize } from "../middleware/auth.js";

import {
  getAttendance,
  checkIn,
  checkOut,
  getMyAttendance
} from "../controllers/attendanceController.js";

const router = express.Router();

router.get("/", protect, authorize("HR"), getAttendance);

router.get("/me", protect, authorize("EMPLOYEE"), getMyAttendance);

router.post("/check-in", protect, authorize("EMPLOYEE"), checkIn);

router.post("/check-out", protect, authorize("EMPLOYEE"), checkOut);

export default router;