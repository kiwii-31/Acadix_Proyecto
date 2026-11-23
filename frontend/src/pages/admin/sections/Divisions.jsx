import { useEffect, useState } from "react";
import { api } from "../../../services/api.js";
import "./Divisions.css";

function Divisions() {
  const [years, setYears] = useState([]);
  const [courses, setCourses] = useState([]);
  const [divisions, setDivisions] = useState([]);

  const [selectedYear, setSelectedYear] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");

  const [divisionName, setDivisionName] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
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

    loadYears();
  }, []);

  useEffect(() => {
    const loadCourses = async () => {
      if (!selectedYear) {
        setCourses([]);
        setSelectedCourse("");
        return;
      }

      try {
        setError("");
        setSuccess("");
        setSelectedCourse("");
        setDivisions([]);

        const data = await api(`/courses?academicYearId=${selectedYear}`);

        setCourses(data.courses);

        if (data.courses.length > 0) {
          setSelectedCourse(data.courses[0].id);
        }
      } catch (err) {
        setError(err.message);
      }
    };

    loadCourses();
  }, [selectedYear]);

  const loadDivisions = async () => {
    if (!selectedCourse) {
      setDivisions([]);
      return;
    }

    setLoading(true);

    try {
      const data = await api(`/divisions?courseId=${selectedCourse}`);

      setDivisions(data.divisions);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDivisions();
  }, [selectedCourse]);

  const handleCreateDivision = async (event) => {
    event.preventDefault();

    if (!divisionName.trim() || !selectedCourse) {
      setError("Ingresá un nombre y seleccioná un curso.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const data = await api("/divisions", {
        method: "POST",
        body: JSON.stringify({
          name: divisionName.trim(),
          courseId: selectedCourse,
        }),
      });

      setDivisionName("");
      setSuccess(data.message || "División creada correctamente.");

      await loadDivisions();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="divisions-section">
      <div className="divisions-intro">
        <div>
          <h3>Organización de divisiones</h3>
          <p>
            Consultá y administrá las divisiones correspondientes a cada curso y
            año lectivo.
          </p>
        </div>
      </div>

      <div className="divisions-filters">
        <div className="division-filter">
          <label htmlFor="division-year">Año lectivo</label>
          <select
            id="division-year"
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

        <div className="division-filter">
          <label htmlFor="division-course">Curso</label>
          <select
            id="division-course"
            value={selectedCourse}
            onChange={(event) => setSelectedCourse(event.target.value)}
            disabled={!courses.length}>
            <option value="">Seleccioná un curso</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && <p className="divisions-error">{error}</p>}
      {success && <p className="divisions-success">{success}</p>}

      <form className="division-create-form" onSubmit={handleCreateDivision}>
        <div>
          <h3>Crear división</h3>
          <p>Agregá una división al curso seleccionado.</p>
        </div>

        <div className="division-create-fields">
          <div className="division-filter">
            <label htmlFor="division-name">Nombre de la división</label>
            <input
              id="division-name"
              type="text"
              placeholder="Ej. A"
              value={divisionName}
              onChange={(event) => setDivisionName(event.target.value)}
              maxLength={20}
              disabled={!selectedCourse || saving}
            />
          </div>

          <button
            type="submit"
            disabled={!selectedCourse || !divisionName.trim() || saving}>
            {saving ? "Creando..." : "Crear división"}
          </button>
        </div>
      </form>

      <section className="divisions-list-section">
        <div className="divisions-list-heading">
          <h3>Divisiones registradas</h3>
          <span>{divisions.length} divisiones</span>
        </div>

        {loading ? (
          <p>Cargando divisiones...</p>
        ) : divisions.length === 0 ? (
          <p>Todavía no hay divisiones registradas para este curso.</p>
        ) : (
          <div className="divisions-list">
            {divisions.map((division) => (
              <article className="division-card" key={division.id}>
                <div className="division-card-icon">▥</div>
                <div>
                  <h4>{division.name}.ª</h4>
                  <p>{division._count.enrollments} estudiantes inscriptos</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Divisions;
