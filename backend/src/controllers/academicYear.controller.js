import prisma from "../config/prisma.js";

// Listar años lectivos
export const getAcademicYears = async (req, res) => {
  try {
    const years = await prisma.academicYear.findMany({
      orderBy: {
        name: "desc",
      },
      include: {
        _count: {
          select: {
            courses: true,
            enrollments: true,
          },
        },
      },
    });

    return res.json({ years });
  } catch (error) {
    console.error("Error al listar años lectivos:", error);

    return res.status(500).json({
      message: "No se pudieron obtener los años lectivos.",
    });
  }
};

// Crear año lectivo
export const createAcademicYear = async (req, res) => {
  try {
    const { name, startDate, endDate } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        message: "El nombre del año lectivo es obligatorio.",
      });
    }

    const parsedStartDate = startDate ? new Date(startDate) : null;
    const parsedEndDate = endDate ? new Date(endDate) : null;

    if (
      (parsedStartDate && isNaN(parsedStartDate.getTime())) ||
      (parsedEndDate && isNaN(parsedEndDate.getTime()))
    ) {
      return res.status(400).json({
        message: "Las fechas ingresadas no son válidas.",
      });
    }

    if (parsedStartDate && parsedEndDate && parsedStartDate > parsedEndDate) {
      return res.status(400).json({
        message:
          "La fecha de inicio no puede ser posterior a la de finalización.",
      });
    }

    const year = await prisma.academicYear.create({
      data: {
        name: name.trim(),
        startDate: parsedStartDate,
        endDate: parsedEndDate,
      },
    });

    return res.status(201).json({
      message: "Año lectivo creado correctamente.",
      year,
    });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({
        message: "Ese año lectivo ya está registrado.",
      });
    }

    console.error("Error al crear año lectivo:", error);

    return res.status(500).json({
      message: "No se pudo crear el año lectivo.",
    });
  }
};

// Modificar año lectivo
export const updateAcademicYear = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, startDate, endDate } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        message: "El nombre del año lectivo es obligatorio.",
      });
    }

    const parsedStartDate = startDate ? new Date(startDate) : null;
    const parsedEndDate = endDate ? new Date(endDate) : null;

    if (
      (parsedStartDate && isNaN(parsedStartDate.getTime())) ||
      (parsedEndDate && isNaN(parsedEndDate.getTime()))
    ) {
      return res.status(400).json({
        message: "Las fechas ingresadas no son válidas.",
      });
    }

    if (parsedStartDate && parsedEndDate && parsedStartDate > parsedEndDate) {
      return res.status(400).json({
        message:
          "La fecha de inicio no puede ser posterior a la de finalización.",
      });
    }

    const year = await prisma.academicYear.update({
      where: { id },
      data: {
        name: name.trim(),
        startDate: parsedStartDate,
        endDate: parsedEndDate,
      },
    });

    return res.json({
      message: "Año lectivo actualizado correctamente.",
      year,
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({
        message: "No se encontró el año lectivo.",
      });
    }

    if (error.code === "P2002") {
      return res.status(409).json({
        message: "Ese año lectivo ya está registrado.",
      });
    }

    console.error("Error al actualizar año lectivo:", error);

    return res.status(500).json({
      message: "No se pudo actualizar el año lectivo.",
    });
  }
};
