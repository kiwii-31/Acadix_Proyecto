import { Router } from "express";
import {
  getAssignments,
  createAssignment,
  deleteAssignment,
  getMyAssignments,
} from "../controllers/assignment.controller.js";
import { requireRole } from "../middlewares/auth.middleware.js";

const router = Router();

// El docente solamente puede consultar sus propias materias.
router.get("/my", requireRole("TEACHER"), getMyAssignments);

// Las siguientes rutas son exclusivas del administrador.
router.use(requireRole("ADMIN"));

router.get("/", getAssignments);
router.post("/", createAssignment);
router.delete("/:id", deleteAssignment);

export default router;
