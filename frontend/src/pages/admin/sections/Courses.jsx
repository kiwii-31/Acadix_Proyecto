import { useEffect, useState } from "react";
import { api } from "../../../services/api.js";
import "./Courses.css";

function Courses() {
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [courses, setCourses] = useState([]);

  const [courseName, setCourseName] = useState("");
  const [courseOrder, setCourseOrder] = useState("");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadYears = async () => {
    try {
      const data = await api("/academic-years");
      setYears(data.years);

      if (data.years.length > 0) {
        setSelectedYear(data.years[0].id);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const loadCourses = async (yearId) => {
    if (!yearId) {
      setCourses([]);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await api(`/courses?academicYearId=${yearId}`);
      setCourses(data.courses);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadYears();
  }, []);

  useEffect(() => {
    setSuccess("");
    setCourseName("");
    setCourseOrder("");
    loadCourses(selectedYear);
  }, [selectedYear]);

  const handleCreateCourse = async (event) => {
    event.preventDefault();

    const order = Number(courseOrder);

    if (!courseName.trim() || !Number.isInteger(order) || order < 1) {
      setError("Ingresá un nombre y un número de curso válido.");
      return;
    }

    if (!selectedYear) {
      setError("Seleccioná un año lectivo.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const data = await api("/courses", {
        method: "POST",
        body: JSON.stringify({
          name: courseName.trim(),
          order,
          academicYearId: selectedYear,
        }),
      });

      setCourseName("");
      setCourseOrder("");
      setSuccess(data.message || "Curso creado correctamente.");

      await loadCourses(selectedYear);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCourse = async (course) => {
    const confirmed = window.confirm(
      `¿Querés eliminar el curso "${course.name}"? Esta acción no se puede deshacer.`,
    );

    if (!confirmed) return;

    setDeleting(true);
    setError("");
    setSuccess("");

    try {
      const data = await api(`/courses/${course.id}`, {
        method: "DELETE",
      });

      setSuccess(data.message || "Curso eliminado correctamente.");
      await loadCourses(selectedYear);
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="courses-section">
      <div className="courses-intro">
        <div>
          <h3>Organización de cursos</h3>
          <p>Administrá los cursos correspondientes a cada año lectivo.</p>
        </div>
      </div>

      <div className="courses-filter">
        <label htmlFor="course-year">Año lectivo</label>
        <select
          id="course-year"
          value={selectedYear}
          onChange={(event) => setSelectedYear(event.target.value)}>
          <option value="">Seleccioná un año</option>
          {years.map((year) => (
            <option key={year.id} value={year.id}>
              {year.name}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="courses-error">{error}</p>}
      {success && <p className="courses-success">{success}</p>}

      <form className="course-create-form" onSubmit={handleCreateCourse}>
        <div>
          <h3>Crear curso</h3>
          <p>Registrá un curso para el año lectivo seleccionado.</p>
        </div>

        <div className="course-create-fields">
          <div className="course-create-field">
            <label htmlFor="course-name">Nombre del curso</label>
            <input
              id="course-name"
              type="text"
              placeholder="Ej. 1.º Año"
              value={courseName}
              onChange={(event) => setCourseName(event.target.value)}
              maxLength={50}
              disabled={!selectedYear || saving}
            />
          </div>

          <div className="course-create-field course-order-field">
            <label htmlFor="course-order">Número de curso</label>
            <input
              id="course-order"
              type="number"
              min="1"
              step="1"
              placeholder="Ej. 1"
              value={courseOrder}
              onChange={(event) => setCourseOrder(event.target.value)}
              disabled={!selectedYear || saving}
            />
          </div>

          <button
            type="submit"
            disabled={
              !selectedYear || !courseName.trim() || !courseOrder || saving
            }>
            {saving ? "Creando..." : "Crear curso"}
          </button>
        </div>
      </form>

      <section className="courses-list-section">
        <h3>Cursos registrados</h3>

        {loading ? (
          <p>Cargando cursos...</p>
        ) : courses.length === 0 ? (
          <p>Todavía no hay cursos registrados para este año.</p>
        ) : (
          <div className="courses-list">
            {courses.map((course) => (
              <article className="course-card" key={course.id}>
                <div>
                  <h4>{course.name}</h4>
                  <p>{course._count.divisions} divisiones</p>
                </div>

                <span>Orden: {course.order}</span>

                <button
                  type="button"
                  className="course-delete-button"
                  onClick={() => handleDeleteCourse(course)}
                  disabled={deleting}>
                  Eliminar
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Courses;
