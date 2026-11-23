import { Router } from "express";
import {
  getEnrollments,
  createEnrollment,
  updateEnrollment,
  getMyEnrollments,
} from "../controllers/enrollment.controller.js";
import { requireRole } from "../middlewares/auth.middleware.js";

const router = Router();

// Consulta exclusiva del estudiante autenticado.
router.get("/my", requireRole("STUDENT"), getMyEnrollments);

// Rutas exclusivas para administradores.
router.use(requireRole("ADMIN"));

router.get("/", getEnrollments);
router.post("/", createEnrollment);
router.put("/:id", updateEnrollment);

export default router;
