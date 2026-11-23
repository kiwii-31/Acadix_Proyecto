import prisma from "../config/prisma.js";

// Listar inscripciones
export const getEnrollments = async (req, res) => {
  try {
    const { academicYearId, studentId } = req.query;

    const enrollments = await prisma.enrollment.findMany({
      where: {
        ...(academicYearId && { academicYearId }),
        ...(studentId && { studentId }),
      },
      include: {
        student: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                isActive: true,
              },
            },
          },
        },
        academicYear: true,
        division: {
          include: {
            course: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json({ enrollments });
  } catch (error) {
    console.error("Error al listar inscripciones:", error);
    return res.status(500).json({
      message: "No se pudieron obtener las inscripciones.",
    });
  }
};

// Crear inscripción
export const createEnrollment = async (req, res) => {
  try {
    const { studentId, academicYearId, divisionId } = req.body;

    if (!studentId || !academicYearId || !divisionId) {
      return res.status(400).json({
        message: "Debés indicar el alumno, el año lectivo y la división.",
      });
    }

    const [student, academicYear, division] = await Promise.all([
      prisma.student.findUnique({ where: { id: studentId } }),
      prisma.academicYear.findUnique({ where: { id: academicYearId } }),
      prisma.division.findUnique({
        where: { id: divisionId },
        include: { course: true },
      }),
    ]);

    if (!student) {
      return res.status(404).json({ message: "El alumno no existe." });
    }

    if (!academicYear) {
      return res.status(404).json({ message: "El año lectivo no existe." });
    }

    if (!division) {
      return res.status(404).json({ message: "La división no existe." });
    }

    if (division.course.academicYearId !== academicYearId) {
      return res.status(400).json({
        message: "La división no pertenece al año lectivo indicado.",
      });
    }

    const enrollment = await prisma.enrollment.create({
      data: {
        studentId,
        academicYearId,
        divisionId,
      },
    });

    return res.status(201).json({
      message: "Inscripción creada correctamente.",
      enrollment,
    });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({
        message: "El alumno ya tiene una inscripción para ese año lectivo.",
      });
    }

    console.error("Error al crear inscripción:", error);
    return res.status(500).json({
      message: "No se pudo crear la inscripción.",
    });
  }
};

// Modificar inscripción
export const updateEnrollment = async (req, res) => {
  try {
    const { id } = req.params;
    const { divisionId } = req.body;

    if (!divisionId) {
      return res.status(400).json({
        message: "Debés indicar la nueva división.",
      });
    }

    const currentEnrollment = await prisma.enrollment.findUnique({
      where: { id },
    });

    if (!currentEnrollment) {
      return res.status(404).json({
        message: "La inscripción no existe.",
      });
    }

    const division = await prisma.division.findUnique({
      where: { id: divisionId },
      include: { course: true },
    });

    if (!division) {
      return res.status(404).json({
        message: "La división no existe.",
      });
    }

    if (division.course.academicYearId !== currentEnrollment.academicYearId) {
      return res.status(400).json({
        message: "La división no pertenece al año lectivo de la inscripción.",
      });
    }

    const enrollment = await prisma.enrollment.update({
      where: { id },
      data: { divisionId },
    });

    return res.json({
      message: "Inscripción actualizada correctamente.",
      enrollment,
    });
  } catch (error) {
    console.error("Error al actualizar inscripción:", error);
    return res.status(500).json({
      message: "No se pudo actualizar la inscripción.",
    });
  }
};

// Consultar las inscripciones del estudiante autenticado
export const getMyEnrollments = async (req, res) => {
  try {
    const student = await prisma.student.findUnique({
      where: {
        userId: req.session.userId,
      },
      include: {
        enrollments: {
          include: {
            academicYear: true,
            division: {
              include: {
                course: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!student) {
      return res.status(404).json({
        message: "No se encontró el perfil del estudiante.",
      });
    }

    return res.json({
      enrollments: student.enrollments,
    });
  } catch (error) {
    console.error(
      "Error al consultar las inscripciones del estudiante:",
      error,
    );

    return res.status(500).json({
      message: "No se pudieron obtener tus datos académicos.",
    });
  }
};
