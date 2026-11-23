import { useEffect, useState } from "react";
import { api } from "../../../services/api.js";
import "./Subjects.css";

function Subjects() {
  const [years, setYears] = useState([]);
  const [courses, setCourses] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [selectedYear, setSelectedYear] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");

  const [subjectName, setSubjectName] = useState("");
  const [editingSubject, setEditingSubject] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadYears = async () => {
      try {
        const data = await api("/academic-years");
        setYears(data.years || []);

        if (data.years?.length > 0) {
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
      setSelectedCourse("");
      setSelectedDivision("");
      setCourses([]);
      setDivisions([]);
      setSubjects([]);

      if (!selectedYear) return;

      try {
        setError("");
        const data = await api(`/courses?academicYearId=${selectedYear}`);

        setCourses(data.courses || []);

        if (data.courses?.length > 0) {
          setSelectedCourse(data.courses[0].id);
        }
      } catch (err) {
        setError(err.message);
      }
    };

    loadCourses();
  }, [selectedYear]);

  useEffect(() => {
    const loadDivisions = async () => {
      setSelectedDivision("");
      setDivisions([]);
      setSubjects([]);

      if (!selectedCourse) return;

      try {
        setError("");
        const data = await api(`/divisions?courseId=${selectedCourse}`);

        setDivisions(data.divisions || []);

        if (data.divisions?.length > 0) {
          setSelectedDivision(data.divisions[0].id);
        }
      } catch (err) {
        setError(err.message);
      }
    };

    loadDivisions();
  }, [selectedCourse]);

  const loadSubjects = async () => {
    if (!selectedDivision) {
      setSubjects([]);
      return;
    }

    setLoading(true);

    try {
      const data = await api(`/subjects?divisionId=${selectedDivision}`);
      setSubjects(data.subjects || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSubjects([]);
    setError("");

    if (selectedDivision) {
      loadSubjects();
    }
  }, [selectedDivision]);

  const openCreateForm = () => {
    setEditingSubject(null);
    setSubjectName("");
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const openEditForm = (subject) => {
    setEditingSubject(subject);
    setSubjectName(subject.name);
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingSubject(null);
    setSubjectName("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!subjectName.trim() || !selectedDivision) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      if (editingSubject) {
        await api(`/subjects/${editingSubject.id}`, {
          method: "PUT",
          body: JSON.stringify({
            name: subjectName.trim(),
          }),
        });

        setSuccess("Materia actualizada correctamente.");
      } else {
        await api("/subjects", {
          method: "POST",
          body: JSON.stringify({
            name: subjectName.trim(),
            divisionId: selectedDivision,
          }),
        });

        setSuccess("Materia creada correctamente.");
      }

      closeForm();
      await loadSubjects();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="subjects-section">
      <div className="subjects-intro">
        <h3>Organización de materias</h3>
        <p>
          Administrá las materias correspondientes a cada división de la
          institución.
        </p>
      </div>

      <div className="subjects-filters">
        <div className="subject-filter">
          <label htmlFor="subject-year">Año lectivo</label>
          <select
            id="subject-year"
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

        <div className="subject-filter">
          <label htmlFor="subject-course">Curso</label>
          <select
            id="subject-course"
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

        <div className="subject-filter">
          <label htmlFor="subject-division">División</label>
          <select
            id="subject-division"
            value={selectedDivision}
            onChange={(event) => setSelectedDivision(event.target.value)}
            disabled={!divisions.length}>
            <option value="">Seleccioná una división</option>
            {divisions.map((division) => (
              <option key={division.id} value={division.id}>
                {division.name}.ª
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && <p className="subjects-error">{error}</p>}
      {success && <p className="subjects-success">{success}</p>}

      {showForm && (
        <form className="subject-form" onSubmit={handleSubmit}>
          <h3>{editingSubject ? "Editar materia" : "Nueva materia"}</h3>

          <label htmlFor="subject-name">Nombre de la materia</label>
          <input
            id="subject-name"
            type="text"
            value={subjectName}
            onChange={(event) => setSubjectName(event.target.value)}
            placeholder="Ej.: Matemática"
            maxLength={100}
            required
          />

          <div className="subject-form-actions">
            <button type="submit" disabled={saving}>
              {saving
                ? "Guardando..."
                : editingSubject
                  ? "Guardar cambios"
                  : "Crear materia"}
            </button>

            <button type="button" onClick={closeForm}>
              Cancelar
            </button>
          </div>
        </form>
      )}

      <section className="subjects-list-section">
        <div className="subjects-list-heading">
          <div>
            <h3>Materias registradas</h3>
            <span>
              {subjects.length} {subjects.length === 1 ? "materia" : "materias"}
            </span>
          </div>

          <button
            type="button"
            onClick={openCreateForm}
            disabled={!selectedDivision}>
            + Nueva materia
          </button>
        </div>

        {loading ? (
          <p>Cargando materias...</p>
        ) : subjects.length === 0 ? (
          <p>Todavía no hay materias registradas para esta división.</p>
        ) : (
          <div className="subjects-list">
            {subjects.map((subject) => (
              <article className="subject-card" key={subject.id}>
                <div className="subject-card-icon">▧</div>

                <div className="subject-card-info">
                  <h4>{subject.name}</h4>
                  <p>{subject._count?.programs || 0} programas</p>
                </div>

                <button
                  type="button"
                  className="subject-edit-button"
                  onClick={() => openEditForm(subject)}>
                  Editar
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Subjects;
