import { Router } from "express";

import {
  getAcademicYears,
  createAcademicYear,
  updateAcademicYear,
} from "../controllers/academicYear.controller.js";

import { requireRole } from "../middlewares/auth.middleware.js";

const router = Router();

// Solo el administrador puede gestionar años lectivos
router.use(requireRole("ADMIN"));

router.get("/", getAcademicYears);
router.post("/", createAcademicYear);
router.put("/:id", updateAcademicYear);

export default router;
