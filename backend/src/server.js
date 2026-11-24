import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import pg from "pg";
import multer from "multer";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import academicYearRoutes from "./routes/academicYear.routes.js";
import courseRoutes from "./routes/course.routes.js";
import divisionRoutes from "./routes/division.routes.js";
import subjectRoutes from "./routes/subject.routes.js";
import assignmentRoutes from "./routes/assignment.routes.js";
import academicPeriodRoutes from "./routes/academicPeriod.routes.js";
import enrollmentRoutes from "./routes/enrollment.routes.js";
import programRoutes from "./routes/program.routes.js";
import topicRoutes from "./routes/topic.routes.js";
import materialRoutes from "./routes/material.routes.js";

dotenv.config();

if (!process.env.SESSION_SECRET) {
  throw new Error("Falta configurar SESSION_SECRET en el archivo .env");
}

const app = express();
app.set("trust proxy", 1);
const PORT = process.env.PORT || 3000;

const { Pool } = pg;
const PgSession = connectPgSimple(session);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.use(helmet());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());

app.use(
  session({
    store: new PgSession({
      pool,
      tableName: "user_sessions",
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 8,
    },
  }),
);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/academic-years", academicYearRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/divisions", divisionRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/academic-periods", academicPeriodRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/programs", programRoutes);
app.use("/api/topics", topicRoutes);
app.use("/api/materials", materialRoutes);

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({
        message: "El archivo no puede superar los 20 MB.",
      });
    }

    return res.status(400).json({
      message: "Error al cargar el archivo.",
    });
  }

  if (err.message === "Solo se permiten archivos PDF.") {
    return res.status(400).json({
      message: err.message,
    });
  }

  console.error("Error del servidor:", err);

  return res.status(500).json({
    message: "Ocurrió un error interno del servidor.",
  });
});

app.get("/", (req, res) => {
  res.send("ACADIX API está funcionando");
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "ACADIX API funcionando correctamente",
  });
});

app.listen(PORT, () => {
  console.log(`ACADIX API disponible en http://localhost:${PORT}`);
});
