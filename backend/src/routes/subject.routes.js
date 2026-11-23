import { Router } from "express";
import {
  getSubjects,
  createSubject,
  updateSubject,
} from "../controllers/subject.controller.js";
import { requireRole } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(requireRole("ADMIN"));

router.get("/", getSubjects);
router.post("/", createSubject);
router.put("/:id", updateSubject);

export default router;