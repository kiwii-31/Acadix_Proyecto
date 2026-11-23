import { Router } from "express";
import {
  getTopics,
  createTopic,
  updateTopic,
  deleteTopic,
  getStudentTopics,
} from "../controllers/topic.controller.js";
import { requireRole } from "../middlewares/auth.middleware.js";

const router = Router();

router.get(
  "/student/:programId",
  requireRole("STUDENT"),
  getStudentTopics
);

router.use(requireRole("TEACHER"));

router.get("/:programId", getTopics);
router.post("/:programId", createTopic);
router.put("/:id", updateTopic);
router.delete("/:id", deleteTopic);

export default router;
