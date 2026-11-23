import { Router } from "express";
import {
  getMaterials,
  createMaterial,
  downloadMaterial,
  deleteMaterial,
  getStudentMaterials,
} from "../controllers/material.controller.js";
import { requireRole } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const router = Router();

// Rutas para docentes
router.get(
  "/student/:topicId",
  requireRole("STUDENT"),
  getStudentMaterials
);

router.get(
    "/student/:id/download",
    requireRole("STUDENT"),
    downloadMaterial
  );

router.get(
  "/:topicId",
  requireRole("TEACHER"),
  getMaterials
);

router.post(
  "/:topicId",
  requireRole("TEACHER"),
  upload.single("file"),
  createMaterial
);

router.get(
  "/:id/download",
  requireRole("TEACHER"),
  downloadMaterial
);

router.delete(
  "/:id",
  requireRole("TEACHER"),
  deleteMaterial
);

export default router;