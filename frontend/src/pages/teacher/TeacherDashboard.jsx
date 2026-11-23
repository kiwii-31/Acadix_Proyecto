import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { api } from "../../services/api.js";
import "./TeacherDashboard.css";
import MySubjects from "./sections/MySubjects.jsx";
import Programs from "./sections/Programs.jsx";

function TeacherDashboard() {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState("overview");
  const [assignments, setAssignments] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [loadingOverview, setLoadingOverview] = useState(true);
  const [overviewError, setOverviewError] = useState("");

  useEffect(() => {
    const loadOverview = async () => {
      try {
        const [assignmentsData, programsData] = await Promise.all([
          api("/assignments/my"),
          api("/programs"),
        ]);

        setAssignments(assignmentsData.assignments || []);
        setPrograms(programsData.programs || []);
      } catch (error) {
        setOverviewError(error.message);
      } finally {
        setLoadingOverview(false);
      }
    };

    loadOverview();
  }, []);

  const sections = [
    { id: "overview", label: "Inicio", icon: "⌂" },
    { id: "subjects", label: "Mis materias", icon: "▤" },
    { id: "programs", label: "Programas", icon: "▣" },
    { id: "account", label: "Mi cuenta", icon: "◉" },
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <div className="teacher-dashboard">
      <aside className="teacher-sidebar">
        <div className="teacher-brand">
          <div className="teacher-logo">A</div>
          <div>
            <h1>ACADIX</h1>
            <span>Panel docente</span>
          </div>
        </div>

        <nav className="teacher-navigation">
          <span className="teacher-nav-title">MENÚ PRINCIPAL</span>

          {sections.map((section) => (
            <button
              key={section.id}
              className={`teacher-nav-button ${
                activeSection === section.id ? "active" : ""
              }`}
              onClick={() => setActiveSection(section.id)}>
              <span>{section.icon}</span>
              {section.label}
            </button>
          ))}
        </nav>

        <button className="teacher-logout-button" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </aside>

      <main className="teacher-main">
        <header className="teacher-header">
          <div>
            <span>ACADIX / Docente</span>
            <h2>
              {sections.find((section) => section.id === activeSection)?.label}
            </h2>
          </div>

          <div className="teacher-profile">
            <div className="teacher-avatar">
              {user?.firstName?.charAt(0).toUpperCase()}
            </div>
            <div>
              <strong>
                {user?.firstName} {user?.lastName}
              </strong>
              <span>Docente</span>
            </div>
          </div>
        </header>

        <section className="teacher-content">
          {activeSection === "overview" && (
            <div className="teacher-overview">
              <div className="teacher-welcome">
                <h3>¡Hola, {user?.firstName}!</h3>
                <p>
                  Bienvenido a tu espacio de trabajo en ACADIX. Desde acá podés
                  organizar tus materias y administrar los materiales
                  educativos.
                </p>
              </div>

              {loadingOverview ? (
                <p>Cargando resumen...</p>
              ) : overviewError ? (
                <p className="teacher-error">{overviewError}</p>
              ) : (
                <>
                  <div className="teacher-stats-grid">
                    <div className="teacher-stat-card">
                      <span>Materias asignadas</span>
                      <strong>{assignments.length}</strong>
                      <small>Materias a tu cargo</small>
                    </div>

                    <div className="teacher-stat-card">
                      <span>Programas totales</span>
                      <strong>{programs.length}</strong>
                      <small>Programas creados</small>
                    </div>

                    <div className="teacher-stat-card">
                      <span>Publicados</span>
                      <strong>
                        {
                          programs.filter(
                            (program) => program.status === "PUBLISHED",
                          ).length
                        }
                      </strong>
                      <small>Disponibles para estudiantes</small>
                    </div>

                    <div className="teacher-stat-card">
                      <span>En borrador</span>
                      <strong>
                        {
                          programs.filter(
                            (program) => program.status === "DRAFT",
                          ).length
                        }
                      </strong>
                      <small>Pendientes de publicación</small>
                    </div>
                  </div>

                  <div className="teacher-overview-section">
                    <div className="teacher-overview-heading">
                      <div>
                        <h3>Mis materias</h3>
                        <p>Materias y divisiones que tenés asignadas.</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setActiveSection("subjects")}>
                        Ver todas
                      </button>
                    </div>

                    {assignments.length === 0 ? (
                      <div className="teacher-empty-state">
                        <h4>Todavía no tenés materias asignadas</h4>
                        <p>
                          Cuando el administrador te asigne una materia,
                          aparecerá acá.
                        </p>
                      </div>
                    ) : (
                      <div className="teacher-subject-grid">
                        {assignments.map((assignment) => (
                          <div
                            className="teacher-subject-card"
                            key={assignment.id}>
                            <h4>{assignment.subject.name}</h4>
                            <p>
                              Curso: {assignment.subject.division.course.name}
                            </p>
                            <p>División: {assignment.subject.division.name}</p>
                            <div className="teacher-subject-card-footer">
                              <span>
                                {assignment._count?.programs ?? 0} programas
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="teacher-overview-section">
                    <div className="teacher-overview-heading">
                      <div>
                        <h3>Programas recientes</h3>
                        <p>Últimos programas que creaste.</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setActiveSection("programs")}>
                        Ver programas
                      </button>
                    </div>

                    {programs.length === 0 ? (
                      <div className="teacher-empty-state">
                        <h4>Todavía no creaste programas</h4>
                        <p>
                          Podés comenzar a organizar los contenidos de tus
                          materias.
                        </p>
                      </div>
                    ) : (
                      <div className="teacher-program-list">
                        {programs.slice(0, 3).map((program) => (
                          <div
                            className="teacher-program-card"
                            key={program.id}>
                            <div>
                              <h4>{program.title}</h4>
                              <p>{program.subject.name}</p>
                              <span>{program.period.name}</span>
                            </div>

                            <div className="teacher-program-details">
                              <span
                                className={`teacher-program-status ${
                                  program.status === "PUBLISHED"
                                    ? "published"
                                    : "draft"
                                }`}>
                                {program.status === "PUBLISHED"
                                  ? "Publicado"
                                  : "Borrador"}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {activeSection === "subjects" && <MySubjects />}

          {activeSection === "programs" && <Programs />}

          {activeSection === "account" && (
            <div className="teacher-account">
              <div className="teacher-section-heading">
                <div>
                  <h3>Mi cuenta</h3>
                  <p>Información de tu perfil en ACADIX.</p>
                </div>
              </div>

              <div className="teacher-account-card">
                <div className="teacher-account-avatar">
                  {user?.firstName?.charAt(0).toUpperCase()}
                </div>

                <h3>
                  {user?.firstName} {user?.lastName}
                </h3>
                <span className="teacher-account-role">Docente</span>

                <div className="teacher-account-details">
                  <div>
                    <span>Nombre</span>
                    <strong>{user?.firstName}</strong>
                  </div>

                  <div>
                    <span>Apellido</span>
                    <strong>{user?.lastName}</strong>
                  </div>

                  <div>
                    <span>Correo electrónico</span>
                    <strong>{user?.email}</strong>
                  </div>

                  <div>
                    <span>Rol</span>
                    <strong>Docente</strong>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default TeacherDashboard;
