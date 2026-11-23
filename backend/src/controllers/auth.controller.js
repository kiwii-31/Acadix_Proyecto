import prisma from "../config/prisma.js";
import bcrypt from "bcryptjs";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Ingresá tu correo y contraseña.",
      });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (!user || !user.isActive) {
      return res.status(401).json({
        message: "Correo o contraseña incorrectos.",
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Correo o contraseña incorrectos.",
      });
    }

    req.session.userId = user.id;
    req.session.role = user.role;

    return res.json({
      message: "Inicio de sesión exitoso.",
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);

    return res.status(500).json({
      message: "Ocurrió un error al iniciar sesión.",
    });
  }
};

export const logout = (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.error("Error al cerrar sesión:", error);

      return res.status(500).json({
        message: "No se pudo cerrar la sesión.",
      });
    }

    res.clearCookie("connect.sid");

    return res.json({
      message: "Sesión cerrada correctamente.",
    });
  });
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.session.userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        isActive: true,
      },
    });

    if (!user || !user.isActive) {
      return res.status(401).json({
        message: "Sesión no válida.",
      });
    }

    return res.json({ user });
  } catch (error) {
    console.error("Error al obtener el usuario:", error);

    return res.status(500).json({
      message: "No se pudo obtener el usuario.",
    });
  }
};
