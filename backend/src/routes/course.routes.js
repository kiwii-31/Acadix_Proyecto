import { Router } from "express";
import {
  getCourses,
  createCourse,
  updateCourse,
} from "../controllers/course.controller.js";
import { requireRole } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(requireRole("ADMIN"));

router.get("/", getCourses);
router.post("/", createCourse);
router.put("/:id", updateCourse);

export default router;