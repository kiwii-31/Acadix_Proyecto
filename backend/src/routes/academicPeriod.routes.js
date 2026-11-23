import { Router } from "express";
import {
  getAcademicPeriods,
  createAcademicPeriod,
  updateAcademicPeriodStatus,
  getOpenAcademicPeriods,
  generateAcademicPeriods,
} from "../controllers/academicPeriod.controller.js";
import { requireRole } from "../middlewares/auth.middleware.js";

const router = Router();

// Consulta exclusiva para docentes.
router.get("/open", requireRole("TEACHER"), getOpenAcademicPeriods);

// Rutas exclusivas para administradores.
router.use(requireRole("ADMIN"));

router.get("/", getAcademicPeriods);
router.post("/", createAcademicPeriod);
router.post("/generate", generateAcademicPeriods);
router.patch("/:id/status", updateAcademicPeriodStatus);

export default router;
