import prisma from "../config/prisma.js";
import bcrypt from "bcryptjs";
import { destroyUserSessions } from "../services/session.service.js";

// Listar usuarios
export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        student: {
          select: {
            id: true,
          },
        },
        teacher: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json({ users });
  } catch (error) {
    console.error("Error al listar usuarios:", error);

    return res.status(500).json({
      message: "No se pudieron obtener los usuarios.",
    });
  }
};

// Crear usuario
export const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    if (
      !firstName?.trim() ||
      !lastName?.trim() ||
      !email?.trim() ||
      !password ||
      !role
    ) {
      return res.status(400).json({
        message: "Todos los campos son obligatorios.",
      });
    }

    const validRoles = ["ADMIN", "TEACHER", "STUDENT"];

    if (!validRoles.includes(role)) {
      return res.status(400).json({
        message: "El rol seleccionado no es válido.",
      });
    }

    if (password.length < 12) {
      return res.status(400).json({
        message: "La contraseña debe tener al menos 12 caracteres.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Ya existe un usuario con ese correo.",
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.$transaction(async (tx) => {
      return tx.user.create({
        data: {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: normalizedEmail,
          passwordHash,
          role,
          ...(role === "TEACHER" && {
            teacher: { create: {} },
          }),
          ...(role === "STUDENT" && {
            student: { create: {} },
          }),
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
          isActive: true,
          createdAt: true,
        },
      });
    });

    return res.status(201).json({
      message: "Usuario creado correctamente.",
      user,
    });
  } catch (error) {
    console.error("Error al crear usuario:", error);

    return res.status(500).json({
      message: "No se pudo crear el usuario.",
    });
  }
};

// Modificar datos de un usuario
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email } = req.body;

    if (!firstName?.trim() || !lastName?.trim() || !email?.trim()) {
      return res.status(400).json({
        message: "Nombre, apellido y correo son obligatorios.",
      });
    }

    const user = await prisma.user.update({
      where: { id },
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        isActive: true,
      },
    });

    return res.json({
      message: "Usuario actualizado correctamente.",
      user,
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({
        message: "No se encontró el usuario.",
      });
    }

    if (error.code === "P2002") {
      return res.status(409).json({
        message: "Ese correo ya está registrado.",
      });
    }

    console.error("Error al actualizar usuario:", error);

    return res.status(500).json({
      message: "No se pudo actualizar el usuario.",
    });
  }
};

// Activar o desactivar un usuario
export const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        message: "El estado debe ser verdadero o falso.",
      });
    }

    if (id === req.session.userId && !isActive) {
      return res.status(400).json({
        message: "No podés desactivar tu propia cuenta.",
      });
    }

    const user = await prisma.user.update({
      where: { id },
      data: { isActive },

      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        isActive: true,
      },
    });

    if (!isActive) {
      await destroyUserSessions(id);
    }

    return res.json({
      message: isActive
        ? "Usuario activado correctamente."
        : "Usuario desactivado correctamente.",
      user,
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({
        message: "No se encontró el usuario.",
      });
    }

    console.error("Error al cambiar estado:", error);

    return res.status(500).json({
      message: "No se pudo modificar el estado del usuario.",
    });
  }
};
export const resetUserPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    if (!password || password.length < 12) {
      return res.status(400).json({
        message: "La contraseña debe tener al menos 12 caracteres.",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return res.status(404).json({
        message: "No se encontró el usuario.",
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await prisma.user.update({
      where: { id },
      data: { passwordHash },
    });

    await destroyUserSessions(id);

    return res.json({
      message: "Contraseña restablecida correctamente.",
    });
  } catch (error) {
    console.error("Error al restablecer contraseña:", error);

    return res.status(500).json({
      message: "No se pudo restablecer la contraseña.",
    });
  }
};
