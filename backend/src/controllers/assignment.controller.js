import prisma from "../config/prisma.js";

// Listar asignaciones
export const getAssignments = async (req, res) => {
  try {
    const { teacherId, subjectId } = req.query;

    const where = {};

    if (teacherId) where.teacherId = teacherId;
    if (subjectId) where.subjectId = subjectId;

    const assignments = await prisma.teacherAssignment.findMany({
      where,
      include: {
        teacher: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
        subject: {
          include: {
            division: {
              include: {
                course: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json({ assignments });
  } catch (error) {
    console.error("Error al listar asignaciones:", error);

    return res.status(500).json({
      message: "No se pudieron obtener las asignaciones.",
    });
  }
};

// Asignar docente a materia
export const createAssignment = async (req, res) => {
  try {
    const { teacherId, subjectId } = req.body;

    if (!teacherId || !subjectId) {
      return res.status(400).json({
        message: "El docente y la materia son obligatorios.",
      });
    }

    const teacher = await prisma.teacher.findUnique({
      where: { id: teacherId },
    });

    if (!teacher) {
      return res.status(404).json({
        message: "No se encontró el docente.",
      });
    }

    const subject = await prisma.subject.findUnique({
      where: { id: subjectId },
    });

    if (!subject) {
      return res.status(404).json({
        message: "No se encontró la materia.",
      });
    }

    const assignment = await prisma.teacherAssignment.create({
      data: {
        teacherId,
        subjectId,
      },
    });

    return res.status(201).json({
      message: "Docente asignado correctamente.",
      assignment,
    });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({
        message: "Ese docente ya está asignado a esa materia.",
      });
    }

    console.error("Error al asignar docente:", error);

    return res.status(500).json({
      message: "No se pudo asignar el docente.",
    });
  }
};

// Quitar asignación
export const deleteAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const { replacementTeacherId } = req.body || {};

    const assignment = await prisma.teacherAssignment.findUnique({
      where: { id },
    });

    if (!assignment) {
      return res.status(404).json({
        message: "No se encontró la asignación.",
      });
    }

    const programs = await prisma.program.findMany({
      where: {
        subjectId: assignment.subjectId,
        responsibleTeacherId: assignment.teacherId,
      },
      select: { id: true },
    });

    if (programs.length > 0) {
      if (!replacementTeacherId) {
        return res.status(409).json({
          requiresReplacement: true,
          programsCount: programs.length,
          message:
            "Este docente tiene programas a su cargo. Elegí un reemplazante para continuar.",
        });
      }

      if (replacementTeacherId === assignment.teacherId) {
        return res.status(400).json({
          message: "El reemplazante debe ser otro docente.",
        });
      }

      const replacementAssignment = await prisma.teacherAssignment.findUnique({
        where: {
          teacherId_subjectId: {
            teacherId: replacementTeacherId,
            subjectId: assignment.subjectId,
          },
        },
      });

      if (!replacementAssignment) {
        return res.status(400).json({
          message:
            "El docente reemplazante debe estar asignado a esa misma materia.",
        });
      }
    }

    await prisma.$transaction(async (tx) => {
      if (programs.length > 0) {
        await tx.program.updateMany({
          where: {
            subjectId: assignment.subjectId,
            responsibleTeacherId: assignment.teacherId,
          },
          data: {
            responsibleTeacherId: replacementTeacherId,
          },
        });
      }

      await tx.teacherAssignment.delete({
        where: { id },
      });
    });

    return res.json({
      message:
        programs.length > 0
          ? "Responsabilidades transferidas y asignación eliminada correctamente."
          : "Asignación eliminada correctamente.",
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({
        message: "No se encontró la asignación.",
      });
    }

    console.error("Error al eliminar asignación:", error);

    return res.status(500).json({
      message: "No se pudo eliminar la asignación.",
    });
  }
};

export const getMyAssignments = async (req, res) => {
  try {
    const teacher = await prisma.teacher.findUnique({
      where: {
        userId: req.session.userId,
      },
    });

    if (!teacher) {
      return res.status(404).json({
        message: "No se encontró el perfil docente.",
      });
    }

    const assignments = await prisma.teacherAssignment.findMany({
      where: {
        teacherId: teacher.id,
      },
      include: {
        subject: {
          include: {
            division: {
              include: {
                course: {
                  include: {
                    academicYear: true,
                  },
                },
              },
            },
            _count: {
              select: {
                programs: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json({ assignments });
  } catch (error) {
    console.error("Error al obtener materias del docente:", error);

    return res.status(500).json({
      message: "No se pudieron obtener tus materias.",
    });
  }
};
