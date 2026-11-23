import prisma from "../config/prisma.js";

// Obtener los materiales de un tema
export const getMaterials = async (req, res) => {
  try {
    const { topicId } = req.params;

    const teacher = await prisma.teacher.findUnique({
      where: { userId: req.session.userId },
    });

    if (!teacher) {
      return res.status(404).json({
        message: "No se encontró el perfil del docente.",
      });
    }

    const topic = await prisma.topic.findUnique({
      where: { id: topicId },
      include: { program: true },
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

    const materials = await prisma.material.findMany({
      where: { topicId },
      select: {
        id: true,
        title: true,
        description: true,
        fileName: true,
        mimeType: true,
        sizeBytes: true,
        topicId: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({ materials });
  } catch (error) {
    console.error("Error al obtener los materiales:", error);

    return res.status(500).json({
      message: "Error al obtener los materiales.",
    });
  }
};

// Subir un material PDF
export const createMaterial = async (req, res) => {
  try {
    const { topicId } = req.params;
    const { title, description } = req.body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return res.status(400).json({
        message: "El título del material es obligatorio.",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Debés seleccionar un archivo PDF.",
      });
    }

    if (req.file.mimetype !== "application/pdf") {
      return res.status(400).json({
        message: "El archivo debe ser un PDF.",
      });
    }

    if (!req.file.buffer.subarray(0, 5).equals(Buffer.from("%PDF-"))) {
      return res.status(400).json({
        message: "El archivo seleccionado no es un PDF válido.",
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
      where: { id: topicId },
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
        message: "No se pueden agregar materiales a un período cerrado.",
      });
    }

    const material = await prisma.material.create({
      data: {
        title: title.trim(),
        description:
          typeof description === "string" ? description.trim() : null,
        fileName: req.file.originalname,
        mimeType: "application/pdf",
        sizeBytes: req.file.size,
        fileData: req.file.buffer,
        topicId,
      },
      select: {
        id: true,
        title: true,
        description: true,
        fileName: true,
        mimeType: true,
        sizeBytes: true,
        topicId: true,
        createdAt: true,
      },
    });

    return res.status(201).json({
      message: "Material PDF subido correctamente.",
      material,
    });
  } catch (error) {
    console.error("Error al subir el material:", error);

    return res.status(500).json({
      message: "Error al subir el material.",
    });
  }
};

// Descargar material
export const downloadMaterial = async (req, res) => {
  try {
    const material = await prisma.material.findUnique({
      where: { id: req.params.id },
      include: {
        topic: {
          include: {
            program: {
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
            },
          },
        },
      },
    });

    if (!material) {
      return res.status(404).json({
        message: "No se encontró el material.",
      });
    }

    const program = material.topic.program;

    if (req.session.role === "TEACHER") {
      const teacher = await prisma.teacher.findUnique({
        where: { userId: req.session.userId },
      });

      if (!teacher) {
        return res.status(404).json({
          message: "No se encontró el perfil del docente.",
        });
      }

      if (program.responsibleTeacherId !== teacher.id) {
        return res.status(403).json({
          message: "No tenés permiso para descargar este material.",
        });
      }
    } else if (req.session.role === "STUDENT") {
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

      if (program.status !== "PUBLISHED") {
        return res.status(403).json({
          message: "Este programa no está publicado.",
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
          message: "No tenés acceso a este material.",
        });
      }
    } else {
      return res.status(403).json({
        message: "No tenés permiso para descargar este material.",
      });
    }

    res.setHeader("Content-Type", material.mimeType);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${encodeURIComponent(material.fileName)}"`,
    );

    return res.send(material.fileData);
  } catch (error) {
    console.error("Error al descargar material:", error);
    return res.status(500).json({
      message: "Error al descargar el material.",
    });
  }
};

// Eliminar un material
export const deleteMaterial = async (req, res) => {
  try {
    const teacher = await prisma.teacher.findUnique({
      where: { userId: req.session.userId },
    });

    if (!teacher) {
      return res.status(404).json({
        message: "No se encontró el perfil del docente.",
      });
    }

    const material = await prisma.material.findUnique({
      where: { id: req.params.id },
      include: {
        topic: {
          include: {
            program: {
              include: {
                period: true,
              },
            },
          },
        },
      },
    });

    if (!material) {
      return res.status(404).json({
        message: "No se encontró el material.",
      });
    }

    if (material.topic.program.responsibleTeacherId !== teacher.id) {
      return res.status(403).json({
        message: "No sos el docente responsable de este programa.",
      });
    }

    if (material.topic.program.period.status !== "OPEN") {
      return res.status(400).json({
        message: "No se pueden eliminar materiales de un período cerrado.",
      });
    }

    await prisma.material.delete({
      where: { id: req.params.id },
    });

    return res.status(200).json({
      message: "Material eliminado correctamente.",
    });
  } catch (error) {
    console.error("Error al eliminar el material:", error);

    return res.status(500).json({
      message: "Error al eliminar el material.",
    });
  }
};

// Obtener materiales de un tema para estudiantes
export const getStudentMaterials = async (req, res) => {
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

    const topic = await prisma.topic.findUnique({
      where: { id: req.params.topicId },
      include: {
        program: {
          include: {
            subject: {
              select: {
                divisionId: true,
                division: {
                  select: {
                    course: {
                      select: {
                        academicYearId: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!topic || topic.program.status !== "PUBLISHED") {
      return res.status(404).json({
        message: "No se encontró el tema o no está publicado.",
      });
    }

    const programDivisionId = topic.program.subject.divisionId;
    const programAcademicYearId =
      topic.program.subject.division.course.academicYearId;

    const hasAccess = student.enrollments.some(
      (enrollment) =>
        enrollment.divisionId === programDivisionId &&
        enrollment.academicYearId === programAcademicYearId,
    );

    if (!hasAccess) {
      return res.status(403).json({
        message: "No tenés acceso a los materiales de este tema.",
      });
    }

    const materials = await prisma.material.findMany({
      where: { topicId: req.params.topicId },
      select: {
        id: true,
        title: true,
        description: true,
        fileName: true,
        mimeType: true,
        sizeBytes: true,
        topicId: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({ materials });
  } catch (error) {
    console.error("Error al obtener materiales del estudiante:", error);

    return res.status(500).json({
      message: "Error al obtener los materiales.",
    });
  }
};
