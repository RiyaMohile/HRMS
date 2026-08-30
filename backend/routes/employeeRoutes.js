import express from "express";

import { protect, authorize } from "../middleware/auth.js";

import {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee
} from "../controllers/employeeController.js";

const router = express.Router();

router.use(protect, authorize("HR"));

router.get("/", getEmployees);

router.get("/:id", getEmployee);

router.post("/", createEmployee);

router.put("/:id", updateEmployee);

export default router;