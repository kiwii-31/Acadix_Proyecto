import { Router } from "express";
import {
  getPrograms,
  createProgram,
  updateProgram,
  publishProgram,
  deleteProgram,
  getStudentPrograms,
} from "../controllers/program.controller.js";
import { requireRole } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/student", requireRole("STUDENT"), getStudentPrograms);
router.use(requireRole("TEACHER"));

router.get("/", getPrograms);
router.post("/", createProgram);
router.put("/:id", updateProgram);
router.patch("/:id/publish", publishProgram);
router.delete("/:id", deleteProgram);

export default router;
