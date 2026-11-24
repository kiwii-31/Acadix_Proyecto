import prisma from "../config/prisma.js";

// Listar cursos de un año lectivo
export const getCourses = async (req, res) => {
  try {
    const { academicYearId } = req.query;

    if (!academicYearId) {
      return res.status(400).json({
        message: "Debés indicar el año lectivo.",
      });
    }

    const courses = await prisma.course.findMany({
      where: { academicYearId },
      include: {
        _count: {
          select: {
            divisions: true,
          },
        },
      },
      orderBy: {
        order: "asc",
      },
    });

    return res.json({ courses });
  } catch (error) {
    console.error("Error al listar cursos:", error);

    return res.status(500).json({
      message: "No se pudieron obtener los cursos.",
    });
  }
};

// Crear curso
export const createCourse = async (req, res) => {
  try {
    const { name, order, academicYearId } = req.body;

    if (
      !name?.trim() ||
      !academicYearId ||
      !Number.isInteger(order) ||
      order < 1
    ) {
      return res.status(400).json({
        message: "Nombre, número de curso y año lectivo son obligatorios.",
      });
    }

    const academicYear = await prisma.academicYear.findUnique({
      where: { id: academicYearId },
    });

    if (!academicYear) {
      return res.status(404).json({
        message: "No se encontró el año lectivo.",
      });
    }

    const course = await prisma.course.create({
      data: {
        name: name.trim(),
        order,
        academicYearId,
      },
    });

    return res.status(201).json({
      message: "Curso creado correctamente.",
      course,
    });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({
        message:
          "Ya existe un curso con ese nombre o número en el año lectivo.",
      });
    }

    console.error("Error al crear curso:", error);

    return res.status(500).json({
      message: "No se pudo crear el curso.",
    });
  }
};

// Modificar curso
export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, order } = req.body;

    if (!name?.trim() || !Number.isInteger(order) || order < 1) {
      return res.status(400).json({
        message: "Nombre y número de curso son obligatorios.",
      });
    }

    const course = await prisma.course.update({
      where: { id },
      data: {
        name: name.trim(),
        order,
      },
    });

    return res.json({
      message: "Curso actualizado correctamente.",
      course,
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({
        message: "No se encontró el curso.",
      });
    }

    if (error.code === "P2002") {
      return res.status(409).json({
        message: "Ya existe un curso con ese nombre o número.",
      });
    }

    console.error("Error al actualizar curso:", error);

    return res.status(500).json({
      message: "No se pudo actualizar el curso.",
    });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            divisions: true,
          },
        },
      },
    });

    if (!course) {
      return res.status(404).json({
        message: "No se encontró el curso.",
      });
    }

    if (course._count.divisions > 0) {
      return res.status(409).json({
        message:
          "No se puede eliminar el curso porque tiene divisiones asociadas.",
      });
    }

    await prisma.course.delete({
      where: { id },
    });

    return res.json({
      message: "Curso eliminado correctamente.",
    });
  } catch (error) {
    console.error("Error al eliminar curso:", error);

    return res.status(500).json({
      message: "No se pudo eliminar el curso.",
    });
  }
};
