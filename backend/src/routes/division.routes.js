import { Router } from "express";
import {
  getDivisions,
  createDivision,
  updateDivision,
  deleteDivision,
} from "../controllers/division.controller.js";
import { requireRole } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(requireRole("ADMIN"));

router.get("/", getDivisions);
router.post("/", createDivision);
router.put("/:id", updateDivision);
router.delete("/:id", deleteDivision);

export default router;
