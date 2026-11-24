import prisma from "../config/prisma.js";

// Listar materias de una división
export const getSubjects = async (req, res) => {
  try {
    const { divisionId } = req.query;

    if (!divisionId) {
      return res.status(400).json({
        message: "Debés indicar la división.",
      });
    }

    const subjects = await prisma.subject.findMany({
      where: { divisionId },
      include: {
        _count: {
          select: {
            programs: true,
            assignments: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return res.json({ subjects });
  } catch (error) {
    console.error("Error al listar materias:", error);

    return res.status(500).json({
      message: "No se pudieron obtener las materias.",
    });
  }
};

// Crear materia
export const createSubject = async (req, res) => {
  try {
    const { name, divisionId } = req.body;

    if (!name?.trim() || !divisionId) {
      return res.status(400).json({
        message: "El nombre de la materia y la división son obligatorios.",
      });
    }

    const division = await prisma.division.findUnique({
      where: { id: divisionId },
    });

    if (!division) {
      return res.status(404).json({
        message: "No se encontró la división.",
      });
    }

    const subject = await prisma.subject.create({
      data: {
        name: name.trim(),
        divisionId,
      },
    });

    return res.status(201).json({
      message: "Materia creada correctamente.",
      subject,
    });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({
        message: "Esa materia ya existe en la división.",
      });
    }

    console.error("Error al crear materia:", error);

    return res.status(500).json({
      message: "No se pudo crear la materia.",
    });
  }
};

// Modificar materia
export const updateSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        message: "El nombre de la materia es obligatorio.",
      });
    }

    const subject = await prisma.subject.update({
      where: { id },
      data: {
        name: name.trim(),
      },
    });

    return res.json({
      message: "Materia actualizada correctamente.",
      subject,
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({
        message: "No se encontró la materia.",
      });
    }

    if (error.code === "P2002") {
      return res.status(409).json({
        message: "Ya existe esa materia en la división.",
      });
    }

    console.error("Error al actualizar materia:", error);

    return res.status(500).json({
      message: "No se pudo actualizar la materia.",
    });
  }
};

export const deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;

    const subject = await prisma.subject.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            programs: true,
            assignments: true,
          },
        },
      },
    });

    if (!subject) {
      return res.status(404).json({
        message: "No se encontró la materia.",
      });
    }

    if (subject._count.programs > 0 || subject._count.assignments > 0) {
      return res.status(409).json({
        message:
          "No se puede eliminar la materia porque tiene programas o asignaciones docentes asociadas.",
      });
    }

    await prisma.subject.delete({
      where: { id },
    });

    return res.json({
      message: "Materia eliminada correctamente.",
    });
  } catch (error) {
    console.error("Error al eliminar materia:", error);

    return res.status(500).json({
      message: "No se pudo eliminar la materia.",
    });
  }
};
