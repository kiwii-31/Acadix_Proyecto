import { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import "./AdminDashboard.css";
import AcademicYears from "./sections/AcademicYears.jsx";
import Courses from "./sections/Courses.jsx";
import Divisions from "./sections/Divisions.jsx";
import Subjects from "./sections/Subjects.jsx";
import Teachers from "./sections/Teachers.jsx";
import Assignments from "./sections/Assignments.jsx";
import AcademicPeriods from "./sections/AcademicPeriods.jsx";
import Enrollments from "./sections/Enrollments.jsx";
import Users from "./sections/Users.jsx";

const sections = [
  { id: "overview", label: "Inicio", icon: "⌂" },
  { id: "users", label: "Usuarios", icon: "♙" },
  { id: "years", label: "Años lectivos", icon: "▦" },
  { id: "courses", label: "Cursos", icon: "▤" },
  { id: "divisions", label: "Divisiones", icon: "▥" },
  { id: "subjects", label: "Materias", icon: "▧" },
  { id: "teachers", label: "Docentes", icon: "♧" },
  { id: "assignments", label: "Asignaciones", icon: "⇄" },
  { id: "periods", label: "Períodos", icon: "◷" },
  { id: "enrollments", label: "Inscripciones", icon: "♧" },
];

function AdminDashboard() {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState("overview");

  const currentSection = sections.find(
    (section) => section.id === activeSection,
  );

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="admin-logo">A</div>
          <div>
            <h1>ACADIX</h1>
            <span>Administración</span>
          </div>
        </div>

        <nav className="admin-nav">
          <span className="nav-heading">MENÚ PRINCIPAL</span>

          {sections.map((section) => (
            <button
              key={section.id}
              className={`nav-item ${
                activeSection === section.id ? "active" : ""
              }`}
              onClick={() => setActiveSection(section.id)}>
              <span className="nav-icon">{section.icon}</span>
              {section.label}
            </button>
          ))}
        </nav>

        <button className="admin-logout" onClick={logout}>
          ↪ Cerrar sesión
        </button>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div>
            <span className="header-subtitle">Panel de administración</span>
            <h2>{currentSection?.label}</h2>
          </div>

          <div className="admin-profile">
            <div className="profile-avatar">{user?.firstName?.charAt(0)}</div>
            <div>
              <strong>
                {user?.firstName} {user?.lastName}
              </strong>
              <span>Administrador</span>
            </div>
          </div>
        </header>

        <section className="admin-content">
          {activeSection === "overview" ? (
            <>
              <div className="welcome-section">
                <span>BIENVENIDO/A A ACADIX</span>
                <h3>Hola, {user?.firstName} 👋</h3>
                <p>
                  Desde acá podés administrar la organización académica y los
                  usuarios de la institución.
                </p>
              </div>
              <h3 className="content-title">Gestión institucional</h3>
              <div className="admin-section-grid">
                {sections.slice(1).map((section) => (
                  <button
                    key={section.id}
                    className="admin-section-card"
                    onClick={() => setActiveSection(section.id)}>
                    <span className="card-icon">{section.icon}</span>
                    <strong>{section.label}</strong>
                    <span className="card-arrow">→</span>
                  </button>
                ))}
              </div>
            </>
          ) : activeSection === "users" ? (
            <Users />
          ) : activeSection === "years" ? (
            <AcademicYears />
          ) : activeSection === "courses" ? (
            <Courses />
          ) : activeSection === "divisions" ? (
            <Divisions />
          ) : activeSection === "subjects" ? (
            <Subjects />
          ) : activeSection === "teachers" ? (
            <Teachers />
          ) : activeSection === "assignments" ? (
            <Assignments />
          ) : activeSection === "periods" ? (
            <AcademicPeriods />
          ) : activeSection === "enrollments" ? (
            <Enrollments />
          ) : (
            <div className="section-placeholder">
              <span className="placeholder-icon">{currentSection?.icon}</span>
              <h3>{currentSection?.label}</h3>
              <p>
                Esta sección estará disponible cuando conectemos sus
                funcionalidades con el backend.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;
