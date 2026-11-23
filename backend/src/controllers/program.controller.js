import prisma from "../config/prisma.js";

// Listar programas de las materias asignadas al docente
export const getPrograms = async (req, res) => {
  try {
    const teacher = await prisma.teacher.findUnique({
      where: { userId: req.session.userId },
    });

    if (!teacher) {
      return res.status(404).json({
        message: "No se encontró el perfil del docente.",
      });
    }

    const assignments = await prisma.teacherAssignment.findMany({
      where: { teacherId: teacher.id },
      select: { subjectId: true },
    });

    const subjectIds = assignments.map((item) => item.subjectId);

    const programs = await prisma.program.findMany({
      where: {
        subjectId: { in: subjectIds },
      },
      include: {
        subject: {
          include: {
            division: {
              include: { course: true },
            },
          },
        },
        period: true,
        _count: {
          select: { topics: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.json({ programs });
  } catch (error) {
    console.error("Error al listar programas:", error);
    return res.status(500).json({
      message: "No se pudieron obtener los programas.",
    });
  }
};

// Crear programa como borrador
export const createProgram = async (req, res) => {
  try {
    const { title, description, subjectId, periodId } = req.body;

    if (!title?.trim() || !subjectId || !periodId) {
      return res.status(400).json({
        message: "Debés indicar el título, la materia y el período.",
      });
    }

    const teacher = await prisma.teacher.findUnique({
      where: { userId: req.session.userId },
    });

    if (!teacher) {
      return res.status(404).json({
        message: "No se encontró el perfil del docente.",
      });
    }

    // Comprobar que el docente esté asignado a la materia
    const assignment = await prisma.teacherAssignment.findUnique({
      where: {
        teacherId_subjectId: {
          teacherId: teacher.id,
          subjectId,
        },
      },
    });

    if (!assignment) {
      return res.status(403).json({
        message: "No estás asignado a esta materia.",
      });
    }

    const subject = await prisma.subject.findUnique({
      where: { id: subjectId },
      include: {
        division: {
          include: { course: true },
        },
      },
    });

    if (!subject) {
      return res.status(404).json({
        message: "La materia no existe.",
      });
    }

    const period = await prisma.academicPeriod.findUnique({
      where: { id: periodId },
    });

    if (!period) {
      return res.status(404).json({
        message: "El período académico no existe.",
      });
    }

    if (period.academicYearId !== subject.division.course.academicYearId) {
      return res.status(400).json({
        message: "El período y la materia no pertenecen al mismo año lectivo.",
      });
    }

    if (!["BIMESTER", "RECOVERY"].includes(period.type)) {
      return res.status(400).json({
        message:
          "Los programas solo pueden pertenecer a un bimestre o al recuperatorio.",
      });
    }

    if (period.status !== "OPEN") {
      return res.status(400).json({
        message: "No se pueden crear programas en un período cerrado.",
      });
    }

    const program = await prisma.program.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        subjectId,
        periodId,
        creatorTeacherId: teacher.id,
        responsibleTeacherId: teacher.id,
        status: "DRAFT",
      },
      include: {
        subject: true,
        period: true,
      },
    });

    return res.status(201).json({
      message: "Programa creado correctamente como borrador.",
      program,
    });
  } catch (error) {
    console.error("Error al crear programa:", error);

    return res.status(500).json({
      message: "No se pudo crear el programa.",
    });
  }
};

// Editar programa
export const updateProgram = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    const teacher = await prisma.teacher.findUnique({
      where: { userId: req.session.userId },
    });

    if (!teacher) {
      return res.status(404).json({
        message: "No se encontró el perfil del docente.",
      });
    }

    const program = await prisma.program.findUnique({
      where: { id },
      include: {
        period: true,
      },
    });

    if (!program) {
      return res.status(404).json({
        message: "El programa no existe.",
      });
    }

    if (program.responsibleTeacherId !== teacher.id) {
      return res.status(403).json({
        message: "Solo el docente responsable puede editar este programa.",
      });
    }
    if (program.period.status !== "OPEN") {
      return res.status(400).json({
        message: "No se pueden editar programas de un período cerrado.",
      });
    }

    if (title !== undefined && !title.trim()) {
      return res.status(400).json({
        message: "El título no puede estar vacío.",
      });
    }

    const updatedProgram = await prisma.program.update({
      where: { id },
      data: {
        ...(title !== undefined && { title: title.trim() }),
        ...(description !== undefined && {
          description: description.trim() || null,
        }),
      },
    });

    return res.json({
      message: "Programa actualizado correctamente.",
      program: updatedProgram,
    });
  } catch (error) {
    console.error("Error al editar programa:", error);
    return res.status(500).json({
      message: "No se pudo actualizar el programa.",
    });
  }
};

// Publicar programa
export const publishProgram = async (req, res) => {
  try {
    const { id } = req.params;

    const teacher = await prisma.teacher.findUnique({
      where: { userId: req.session.userId },
    });

    if (!teacher) {
      return res.status(404).json({
        message: "No se encontró el perfil del docente.",
      });
    }

    const program = await prisma.program.findUnique({
      where: { id },
      include: { period: true },
    });

    if (!program) {
      return res.status(404).json({
        message: "El programa no existe.",
      });
    }

    if (program.responsibleTeacherId !== teacher.id) {
      return res.status(403).json({
        message: "Solo el docente responsable puede publicar este programa.",
      });
    }

    if (program.status === "PUBLISHED") {
      return res.status(400).json({
        message: "El programa ya está publicado.",
      });
    }

    if (program.period.status !== "OPEN") {
      return res.status(400).json({
        message: "No se puede publicar un programa de un período cerrado.",
      });
    }

    const publishedProgram = await prisma.program.update({
      where: { id },
      data: {
        status: "PUBLISHED",
        publishedAt: new Date(),
      },
    });

    return res.json({
      message: "Programa publicado correctamente.",
      program: publishedProgram,
    });
  } catch (error) {
    console.error("Error al publicar programa:", error);
    return res.status(500).json({
      message: "No se pudo publicar el programa.",
    });
  }
};

export const deleteProgram = async (req, res) => {
  try {
    const teacher = await prisma.teacher.findUnique({
      where: { userId: req.session.userId },
    });

    if (!teacher) {
      return res.status(404).json({
        message: "No se encontró el perfil del docente.",
      });
    }

    const program = await prisma.program.findUnique({
      where: { id: req.params.id },
      include: {
        period: true,
      },
    });

    if (!program) {
      return res.status(404).json({
        message: "No se encontró el programa.",
      });
    }

    if (program.responsibleTeacherId !== teacher.id) {
      return res.status(403).json({
        message: "No sos el docente responsable de este programa.",
      });
    }

    if (program.period.status !== "OPEN") {
      return res.status(400).json({
        message: "No se pueden eliminar programas de un período cerrado.",
      });
    }

    await prisma.program.delete({
      where: { id: req.params.id },
    });

    return res.status(200).json({
      message: "Programa, temas y materiales eliminados correctamente.",
    });
  } catch (error) {
    console.error("Error al eliminar el programa:", error);

    return res.status(500).json({
      message: "Error al eliminar el programa.",
    });
  }
};

// Listar programas publicados de las materias del estudiante
export const getStudentPrograms = async (req, res) => {
  try {
    const student = await prisma.student.findUnique({
      where: { userId: req.session.userId },
      include: {
        enrollments: {
          select: {
            divisionId: true,
            academicYearId: true,
          },
        },
      },
    });

    if (!student) {
      return res.status(404).json({
        message: "No se encontró el perfil del estudiante.",
      });
    }

    const enrollmentConditions = student.enrollments.map((enrollment) => ({
      subject: {
        divisionId: enrollment.divisionId,
        division: {
          course: {
            academicYearId: enrollment.academicYearId,
          },
        },
      },
    }));

    if (enrollmentConditions.length === 0) {
      return res.status(200).json({
        programs: [],
      });
    }

    const programs = await prisma.program.findMany({
      where: {
        status: "PUBLISHED",
        OR: enrollmentConditions,
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
          },
        },
        period: true,
        _count: {
          select: {
            topics: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      programs,
    });
  } catch (error) {
    console.error("Error al obtener programas del estudiante:", error);

    return res.status(500).json({
      message: "Error al obtener los programas.",
    });
  }
};
