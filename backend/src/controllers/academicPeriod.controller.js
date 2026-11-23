import prisma from "../config/prisma.js";

// Listar períodos de un año lectivo
export const getAcademicPeriods = async (req, res) => {
  try {
    const { academicYearId } = req.query;

    if (!academicYearId) {
      return res.status(400).json({
        message: "Debés indicar el año lectivo.",
      });
    }

    const periods = await prisma.academicPeriod.findMany({
      where: { academicYearId },
      include: {
        children: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return res.json({ periods });
  } catch (error) {
    console.error("Error al listar períodos:", error);

    return res.status(500).json({
      message: "No se pudieron obtener los períodos.",
    });
  }
};

// Crear período académico
export const createAcademicPeriod = async (req, res) => {
  try {
    const { name, type, academicYearId, parentId } = req.body;

    const validTypes = ["CUATRIMESTER", "BIMESTER", "RECOVERY"];

    if (!name?.trim() || !type || !academicYearId) {
      return res.status(400).json({
        message: "Nombre, tipo y año lectivo son obligatorios.",
      });
    }

    if (!validTypes.includes(type)) {
      return res.status(400).json({
        message: "El tipo de período no es válido.",
      });
    }

    if (type === "BIMESTER" && !parentId) {
      return res.status(400).json({
        message: "Los bimestres deben pertenecer a un cuatrimestre.",
      });
    }

    if (type !== "BIMESTER" && parentId) {
      return res.status(400).json({
        message: "Solo los bimestres pueden tener un período padre.",
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

    const existingPeriods = await prisma.academicPeriod.count({
      where: { academicYearId },
    });

    if (existingPeriods >= 7) {
      return res.status(409).json({
        message:
          "Este año lectivo ya tiene su estructura de períodos completa.",
      });
    }

    if (parentId) {
      const parent = await prisma.academicPeriod.findUnique({
        where: { id: parentId },
      });

      if (
        !parent ||
        parent.academicYearId !== academicYearId ||
        parent.type !== "CUATRIMESTER"
      ) {
        return res.status(400).json({
          message: "El cuatrimestre indicado no es válido.",
        });
      }
    }

    const period = await prisma.academicPeriod.create({
      data: {
        name: name.trim(),
        type,
        academicYearId,
        parentId: parentId || null,
      },
    });

    return res.status(201).json({
      message: "Período creado correctamente.",
      period,
    });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({
        message: "Ya existe un período con ese nombre en el año lectivo.",
      });
    }

    console.error("Error al crear período:", error);

    return res.status(500).json({
      message: "No se pudo crear el período.",
    });
  }
};

// Abrir o cerrar período
export const updateAcademicPeriodStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["OPEN", "CLOSED"].includes(status)) {
      return res.status(400).json({
        message: "El estado debe ser OPEN o CLOSED.",
      });
    }

    const period = await prisma.academicPeriod.update({
      where: { id },
      data: { status },
    });

    return res.json({
      message: "Estado del período actualizado correctamente.",
      period,
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({
        message: "No se encontró el período.",
      });
    }

    console.error("Error al actualizar período:", error);

    return res.status(500).json({
      message: "No se pudo actualizar el período.",
    });
  }
};

// Listar períodos abiertos para docentes
export const getOpenAcademicPeriods = async (req, res) => {
  try {
    const { academicYearId } = req.query;

    if (!academicYearId) {
      return res.status(400).json({
        message: "Debés indicar el año lectivo.",
      });
    }

    const periods = await prisma.academicPeriod.findMany({
      where: {
        academicYearId,
        status: "OPEN",
        type: {
          in: ["BIMESTER", "RECOVERY"],
        },
      },
      include: {
        academicYear: true,
        parent: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return res.json({ periods });
  } catch (error) {
    console.error("Error al listar períodos abiertos:", error);

    return res.status(500).json({
      message: "No se pudieron obtener los períodos abiertos.",
    });
  }
};

// Generar automáticamente la estructura de períodos de un año lectivo
export const generateAcademicPeriods = async (req, res) => {
  try {
    const { academicYearId } = req.body;

    if (!academicYearId) {
      return res.status(400).json({
        message: "Debés indicar el año lectivo.",
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

    const existingPeriods = await prisma.academicPeriod.count({
      where: { academicYearId },
    });

    if (existingPeriods > 0) {
      return res.status(409).json({
        message: "Este año lectivo ya tiene períodos registrados.",
      });
    }

    const periods = await prisma.$transaction(async (tx) => {
      const firstCuatrimestre = await tx.academicPeriod.create({
        data: {
          name: "1.er Cuatrimestre",
          type: "CUATRIMESTER",
          academicYearId,
        },
      });

      const secondCuatrimestre = await tx.academicPeriod.create({
        data: {
          name: "2.º Cuatrimestre",
          type: "CUATRIMESTER",
          academicYearId,
        },
      });

      const firstBimester = await tx.academicPeriod.create({
        data: {
          name: "1.er Bimestre",
          type: "BIMESTER",
          academicYearId,
          parentId: firstCuatrimestre.id,
        },
      });

      const secondBimester = await tx.academicPeriod.create({
        data: {
          name: "2.º Bimestre",
          type: "BIMESTER",
          academicYearId,
          parentId: firstCuatrimestre.id,
        },
      });

      const thirdBimester = await tx.academicPeriod.create({
        data: {
          name: "3.er Bimestre",
          type: "BIMESTER",
          academicYearId,
          parentId: secondCuatrimestre.id,
        },
      });

      const fourthBimester = await tx.academicPeriod.create({
        data: {
          name: "4.º Bimestre",
          type: "BIMESTER",
          academicYearId,
          parentId: secondCuatrimestre.id,
        },
      });

      const recovery = await tx.academicPeriod.create({
        data: {
          name: "Período de Recuperatorio",
          type: "RECOVERY",
          academicYearId,
        },
      });

      return [
        firstCuatrimestre,
        secondCuatrimestre,
        firstBimester,
        secondBimester,
        thirdBimester,
        fourthBimester,
        recovery,
      ];
    });

    return res.status(201).json({
      message: "Los períodos académicos se generaron correctamente.",
      periods,
    });
  } catch (error) {
    console.error("Error al generar períodos:", error);

    return res.status(500).json({
      message: "No se pudieron generar los períodos académicos.",
    });
  }
};
