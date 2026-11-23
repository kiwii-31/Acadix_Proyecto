import { Router } from "express";

import {
  getUsers,
  createUser,
  updateUser,
  updateUserStatus,
  resetUserPassword,
} from "../controllers/user.controller.js";

import { requireRole } from "../middlewares/auth.middleware.js";

const router = Router();

// Todas las rutas requieren permisos de administrador
router.use(requireRole("ADMIN"));

router.get("/", getUsers);
router.post("/", createUser);
router.put("/:id", updateUser);
router.patch("/:id/status", updateUserStatus);
router.patch("/:id/password", resetUserPassword);

export default router;
