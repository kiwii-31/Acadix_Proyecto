import { useEffect, useState } from "react";
import { api } from "../../../services/api.js";
import "./Teachers.css";

function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTeachers = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await api("/users");

      const teacherUsers = data.users.filter((user) => user.role === "TEACHER");

      setTeachers(teacherUsers);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeachers();
  }, []);

  return (
    <div className="teachers-section">
      <div className="teachers-intro">
        <div>
          <h3>Gestión de docentes</h3>
          <p>Consultá los docentes registrados y el estado de sus cuentas.</p>
        </div>

        <span className="teachers-total">{teachers.length} docentes</span>
      </div>

      {error && <p className="teachers-error">{error}</p>}

      <section className="teachers-list-section">
        <div className="teachers-list-heading">
          <h3>Docentes registrados</h3>

          <button type="button" onClick={loadTeachers}>
            Actualizar lista
          </button>
        </div>

        {loading ? (
          <p>Cargando docentes...</p>
        ) : teachers.length === 0 ? (
          <p>Todavía no hay docentes registrados.</p>
        ) : (
          <div className="teachers-list">
            {teachers.map((teacher) => (
              <article className="teacher-card" key={teacher.id}>
                <div className="teacher-avatar">
                  {teacher.firstName?.charAt(0)}
                  {teacher.lastName?.charAt(0)}
                </div>

                <div className="teacher-info">
                  <h4>
                    {teacher.firstName} {teacher.lastName}
                  </h4>
                  <p>{teacher.email}</p>
                </div>

                <span
                  className={`teacher-status ${
                    teacher.isActive ? "active" : "inactive"
                  }`}>
                  {teacher.isActive ? "Activo" : "Inactivo"}
                </span>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Teachers;
