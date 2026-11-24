import prisma from "../config/prisma.js";

// Listar divisiones de un curso
export const getDivisions = async (req, res) => {
  try {
    const { courseId } = req.query;

    if (!courseId) {
      return res.status(400).json({
        message: "Debés indicar el curso.",
      });
    }

    const divisions = await prisma.division.findMany({
      where: { courseId },
      include: {
        _count: {
          select: {
            enrollments: true,
            subjects: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return res.json({ divisions });
  } catch (error) {
    console.error("Error al listar divisiones:", error);

    return res.status(500).json({
      message: "No se pudieron obtener las divisiones.",
    });
  }
};

// Crear división
export const createDivision = async (req, res) => {
  try {
    const { name, courseId } = req.body;

    if (!name?.trim() || !courseId) {
      return res.status(400).json({
        message: "El nombre de la división y el curso son obligatorios.",
      });
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return res.status(404).json({
        message: "No se encontró el curso.",
      });
    }

    const division = await prisma.division.create({
      data: {
        name: name.trim().toUpperCase(),
        courseId,
      },
    });

    return res.status(201).json({
      message: "División creada correctamente.",
      division,
    });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({
        message: "Esa división ya existe en el curso.",
      });
    }

    console.error("Error al crear división:", error);

    return res.status(500).json({
      message: "No se pudo crear la división.",
    });
  }
};

// Modificar división
export const updateDivision = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        message: "El nombre de la división es obligatorio.",
      });
    }

    const division = await prisma.division.update({
      where: { id },
      data: {
        name: name.trim().toUpperCase(),
      },
    });

    return res.json({
      message: "División actualizada correctamente.",
      division,
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({
        message: "No se encontró la división.",
      });
    }

    if (error.code === "P2002") {
      return res.status(409).json({
        message: "Ya existe esa división en el curso.",
      });
    }

    console.error("Error al actualizar división:", error);

    return res.status(500).json({
      message: "No se pudo actualizar la división.",
    });
  }
};

export const deleteDivision = async (req, res) => {
  try {
    const { id } = req.params;

    const division = await prisma.division.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            subjects: true,
            enrollments: true,
          },
        },
      },
    });

    if (!division) {
      return res.status(404).json({
        message: "No se encontró la división.",
      });
    }

    if (division._count.subjects > 0 || division._count.enrollments > 0) {
      return res.status(409).json({
        message:
          "No se puede eliminar la división porque tiene materias o inscripciones asociadas.",
      });
    }

    await prisma.division.delete({
      where: { id },
    });

    return res.json({
      message: "División eliminada correctamente.",
    });
  } catch (error) {
    console.error("Error al eliminar división:", error);

    return res.status(500).json({
      message: "No se pudo eliminar la división.",
    });
  }
};
