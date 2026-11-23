import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { api } from "../../services/api.js";
import "./StudentDashboard.css";
import StudentSubjects from "./StudentSubjects.jsx";
import StudentHistory from "./StudentHistory.jsx";
import StudentAccount from "./StudentAccount.jsx";

function StudentDashboard() {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState("overview");
  const [enrollments, setEnrollments] = useState([]);
  const [studentPrograms, setStudentPrograms] = useState([]);
  const [loadingOverview, setLoadingOverview] = useState(true);
  const [overviewError, setOverviewError] = useState("");

  useEffect(() => {
    const loadOverview = async () => {
      try {
        const [enrollmentData, programsData] = await Promise.all([
          api("/enrollments/my"),
          api("/programs/student"),
        ]);

        setEnrollments(enrollmentData.enrollments || []);
        setStudentPrograms(programsData.programs || []);
      } catch (error) {
        setOverviewError(error.message);
      } finally {
        setLoadingOverview(false);
      }
    };

    loadOverview();
  }, []);

  const currentEnrollment = [...enrollments].sort((a, b) =>
    String(b.academicYear.name).localeCompare(
      String(a.academicYear.name),
      undefined,
      { numeric: true },
    ),
  )[0];
  console.log("INSCRIPCIÓN ACTUAL:", currentEnrollment);
  console.log(
    "PROGRAMAS:",
    studentPrograms.map((program) => ({
      titulo: program.title,
      año: program.subject.division.course.academicYear.name,
      añoId: program.subject.division.course.academicYear.id,
      divisionId: program.subject.divisionId,
    })),
  );

  const availableSubjectCount = new Set(
    studentPrograms.map((program) => program.subject.id),
  ).size;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const sections = [
    { id: "overview", label: "Inicio" },
    { id: "subjects", label: "Mis materias" },
    { id: "history", label: "Historial" },
    { id: "account", label: "Mi cuenta" },
  ];

  return (
    <div className="student-dashboard">
      <aside className="student-sidebar">
        <div className="student-brand">
          <h2>ACADIX</h2>
          <span>Espacio del estudiante</span>
        </div>

        <nav className="student-navigation">
          {sections.map((section) => (
            <button
              key={section.id}
              className={activeSection === section.id ? "active" : ""}
              onClick={() => setActiveSection(section.id)}>
              {section.label}
            </button>
          ))}
        </nav>

        <button className="student-logout" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </aside>

      <main className="student-main">
        <header className="student-header">
          <div>
            <h1>
              {activeSection === "overview" && "Inicio"}
              {activeSection === "subjects" && "Mis materias"}
              {activeSection === "history" && "Historial académico"}
              {activeSection === "account" && "Mi cuenta"}
            </h1>
            <p>Bienvenido/a, {user.firstName}.</p>
          </div>
        </header>

        <section className="student-content">
          {activeSection === "overview" && (
            <div className="student-overview">
              <div className="student-welcome">
                <h2>¡Hola, {user.firstName}!</h2>
                <p>
                  Este es tu espacio académico. Desde acá podés consultar tus
                  materias y acceder a los materiales educativos.
                </p>
              </div>

              {loadingOverview ? (
                <p className="student-loading">
                  Cargando tu información académica...
                </p>
              ) : overviewError ? (
                <p className="student-error">{overviewError}</p>
              ) : (
                <>
                  <div className="student-stats-grid">
                    <div className="student-stat-card">
                      <span>Curso</span>
                      <strong>
                        {currentEnrollment?.division?.course?.name ||
                          "Sin asignar"}
                      </strong>
                    </div>

                    <div className="student-stat-card">
                      <span>División</span>
                      <strong>
                        {currentEnrollment?.division?.name || "Sin asignar"}
                      </strong>
                    </div>

                    <div className="student-stat-card">
                      <span>Año lectivo</span>
                      <strong>
                        {currentEnrollment?.academicYear?.name || "Sin asignar"}
                      </strong>
                    </div>

                    <div className="student-stat-card">
                      <span>Materias con programas publicados</span>
                      <strong>{availableSubjectCount}</strong>
                    </div>
                  </div>

                  <div className="student-overview-section">
                    <h3>Tu espacio académico</h3>
                    <p>
                      Actualmente tenés {studentPrograms.length}{" "}
                      {studentPrograms.length === 1
                        ? "programa publicado"
                        : "programas publicados"}{" "}
                      disponibles para consultar.
                    </p>

                    {!currentEnrollment && (
                      <p className="student-empty">
                        Todavía no tenés una inscripción académica asignada.
                      </p>
                    )}

                    <button onClick={() => setActiveSection("subjects")}>
                      Ver mis materias
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {activeSection === "subjects" && (
            <StudentSubjects currentEnrollment={currentEnrollment} />
          )}

          {activeSection === "history" && (
            <StudentHistory currentEnrollment={currentEnrollment} />
          )}

          {activeSection === "account" && <StudentAccount user={user} />}
        </section>
      </main>
    </div>
  );
}

export default StudentDashboard;
