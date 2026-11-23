import prisma from "../config/prisma.js";

// Obtener los temas de un programa
export const getTopics = async (req, res) => {
  try {
    const { programId } = req.params;

    const teacher = await prisma.teacher.findUnique({
      where: { userId: req.session.userId },
    });

    if (!teacher) {
      return res.status(404).json({
        message: "No se encontró el perfil del docente.",
      });
    }

    const program = await prisma.program.findUnique({
      where: { id: programId },
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

    const topics = await prisma.topic.findMany({
      where: { programId },
      orderBy: { order: "asc" },
      include: {
        _count: {
          select: { materials: true },
        },
      },
    });

    return res.status(200).json({ topics });
  } catch (error) {
    console.error("Error al obtener los temas:", error);

    return res.status(500).json({
      message: "Error al obtener los temas.",
    });
  }
};

// Crear un tema
export const createTopic = async (req, res) => {
  try {
    const { programId } = req.params;
    const { title, description } = req.body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return res.status(400).json({
        message: "El título del tema es obligatorio.",
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

    const program = await prisma.program.findUnique({
      where: { id: programId },
      include: { period: true },
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
        message: "No se pueden agregar temas a un período cerrado.",
      });
    }

    const lastTopic = await prisma.topic.findFirst({
      where: { programId },
      orderBy: { order: "desc" },
    });

    const nextOrder = lastTopic ? lastTopic.order + 1 : 1;

    const topic = await prisma.topic.create({
      data: {
        title: title.trim(),
        description:
          typeof description === "string" ? description.trim() : null,
        order: nextOrder,
        programId,
      },
      include: {
        _count: {
          select: { materials: true },
        },
      },
    });

    return res.status(201).json({
      message: "Tema creado correctamente.",
      topic,
    });
  } catch (error) {
    console.error("Error al crear el tema:", error);

    return res.status(500).json({
      message: "Error al crear el tema.",
    });
  }
};

// Editar un tema
export const updateTopic = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    if (title !== undefined && (typeof title !== "string" || !title.trim())) {
      return res.status(400).json({
        message: "El título del tema no puede estar vacío.",
      });
    }

    if (
      description !== undefined &&
      description !== null &&
      typeof description !== "string"
    ) {
      return res.status(400).json({
        message: "La descripción debe ser un texto válido.",
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

    const topic = await prisma.topic.findUnique({
      where: { id },
      include: {
        program: {
          include: { period: true },
        },
      },
    });

    if (!topic) {
      return res.status(404).json({
        message: "No se encontró el tema.",
      });
    }

    if (topic.program.responsibleTeacherId !== teacher.id) {
      return res.status(403).json({
        message: "No sos el docente responsable de este programa.",
      });
    }

    if (topic.program.period.status !== "OPEN") {
      return res.status(400).json({
        message: "No se pueden editar temas de un período cerrado.",
      });
    }

    const updatedTopic = await prisma.topic.update({
      where: { id },
      data: {
        ...(title !== undefined && { title: title.trim() }),
        ...(description !== undefined && {
          description: description?.trim() || null,
        }),
      },
    });

    return res.status(200).json({
      message: "Tema actualizado correctamente.",
      topic: updatedTopic,
    });
  } catch (error) {
    console.error("Error al actualizar el tema:", error);

    return res.status(500).json({
      message: "Error al actualizar el tema.",
    });
  }
};

// Eliminar un tema
export const deleteTopic = async (req, res) => {
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

    const topic = await prisma.topic.findUnique({
      where: { id },
      include: {
        program: {
          include: { period: true },
        },
      },
    });

    if (!topic) {
      return res.status(404).json({
        message: "No se encontró el tema.",
      });
    }

    if (topic.program.responsibleTeacherId !== teacher.id) {
      return res.status(403).json({
        message: "No sos el docente responsable de este programa.",
      });
    }

    if (topic.program.period.status !== "OPEN") {
      return res.status(400).json({
        message: "No se pueden eliminar temas de un período cerrado.",
      });
    }

    await prisma.topic.delete({
      where: { id },
    });

    return res.status(200).json({
      message: "Tema y materiales asociados eliminados correctamente.",
    });
  } catch (error) {
    console.error("Error al eliminar el tema:", error);

    return res.status(500).json({
      message: "Error al eliminar el tema.",
    });
  }
};

export const getStudentTopics = async (req, res) => {
  try {
    const { programId } = req.params;

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

    const program = await prisma.program.findUnique({
      where: { id: programId },
      include: {
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
    });

    if (!program || program.status !== "PUBLISHED") {
      return res.status(404).json({
        message: "No se encontró el programa publicado.",
      });
    }

    const programDivisionId = program.subject.divisionId;
    const programAcademicYearId =
      program.subject.division.course.academicYearId;

    const hasEnrollment = student.enrollments.some(
      (enrollment) =>
        enrollment.divisionId === programDivisionId &&
        enrollment.academicYearId === programAcademicYearId,
    );

    if (!hasEnrollment) {
      return res.status(403).json({
        message: "No tenés acceso a este programa.",
      });
    }

    const topics = await prisma.topic.findMany({
      where: { programId },
      orderBy: { order: "asc" },
      include: {
        _count: {
          select: { materials: true },
        },
      },
    });

    return res.status(200).json({ topics });
  } catch (error) {
    console.error("Error al obtener los temas del estudiante:", error);

    return res.status(500).json({
      message: "Error al obtener los temas.",
    });
  }
};
