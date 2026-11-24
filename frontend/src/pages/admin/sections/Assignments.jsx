import { useEffect, useState } from "react";
import { api } from "../../../services/api.js";
import "./Assignments.css";

function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [years, setYears] = useState([]);
  const [courses, setCourses] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [teacherId, setTeacherId] = useState("");
  const [yearId, setYearId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [divisionId, setDivisionId] = useState("");
  const [subjectId, setSubjectId] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [replacementTarget, setReplacementTarget] = useState(null);
  const [replacementTeacherId, setReplacementTeacherId] = useState("");

  const loadAssignments = async () => {
    try {
      const data = await api("/assignments");
      setAssignments(data.assignments || []);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setError("");

        const [usersData, yearsData, assignmentsData] = await Promise.all([
          api("/users"),
          api("/academic-years"),
          api("/assignments"),
        ]);

        setTeachers(
          (usersData.users || []).filter(
            (user) =>
              user.role === "TEACHER" && user.isActive && user.teacher?.id,
          ),
        );

        setYears(yearsData.years || []);
        setAssignments(assignmentsData.assignments || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    const loadCourses = async () => {
      if (!yearId) {
        setCourses([]);
        return;
      }

      try {
        const data = await api(`/courses?academicYearId=${yearId}`);
        setCourses(data.courses || []);
      } catch (err) {
        setError(err.message);
      }
    };

    loadCourses();
  }, [yearId]);

  useEffect(() => {
    const loadDivisions = async () => {
      if (!courseId) {
        setDivisions([]);
        return;
      }

      try {
        const data = await api(`/divisions?courseId=${courseId}`);
        setDivisions(data.divisions || []);
      } catch (err) {
        setError(err.message);
      }
    };

    loadDivisions();
  }, [courseId]);

  useEffect(() => {
    const loadSubjects = async () => {
      if (!divisionId) {
        setSubjects([]);
        return;
      }

      try {
        const data = await api(`/subjects?divisionId=${divisionId}`);
        setSubjects(data.subjects || []);
      } catch (err) {
        setError(err.message);
      }
    };

    loadSubjects();
  }, [divisionId]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!teacherId || !subjectId) {
      setError("Seleccioná un docente y una materia.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await api("/assignments", {
        method: "POST",
        body: JSON.stringify({
          teacherId,
          subjectId,
        }),
      });

      setSuccess("Docente asignado correctamente.");
      setTeacherId("");
      setSubjectId("");

      await loadAssignments();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (assignment) => {
    const confirmed = window.confirm(
      `¿Querés quitar la asignación de ${assignment.teacher.user.firstName} ${assignment.teacher.user.lastName} a ${assignment.subject.name}?`,
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");
    setDeleting(true);

    try {
      await api(`/assignments/${assignment.id}`, {
        method: "DELETE",
      });

      setSuccess("Asignación eliminada correctamente.");
      await loadAssignments();
    } catch (err) {
      if (err.data?.requiresReplacement) {
        setReplacementTarget(assignment);
        setReplacementTeacherId("");
        setError("");
      } else {
        setError(err.message);
      }
    } finally {
      setDeleting(false);
    }
  };

  const handleConfirmReplacement = async () => {
    if (!replacementTeacherId || !replacementTarget) {
      setError("Seleccioná un docente reemplazante.");
      return;
    }

    setDeleting(true);
    setError("");
    setSuccess("");

    try {
      const data = await api(`/assignments/${replacementTarget.id}`, {
        method: "DELETE",
        body: JSON.stringify({ replacementTeacherId }),
      });

      setSuccess(data.message || "Asignación eliminada correctamente.");
      setReplacementTarget(null);
      setReplacementTeacherId("");

      await loadAssignments();
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const handleCancelReplacement = () => {
    setReplacementTarget(null);
    setReplacementTeacherId("");
    setError("");
  };

  const handleYearChange = (value) => {
    setYearId(value);
    setCourseId("");
    setDivisionId("");
    setSubjectId("");
    setCourses([]);
    setDivisions([]);
    setSubjects([]);
  };

  const handleCourseChange = (value) => {
    setCourseId(value);
    setDivisionId("");
    setSubjectId("");
    setDivisions([]);
    setSubjects([]);
  };

  const handleDivisionChange = (value) => {
    setDivisionId(value);
    setSubjectId("");
    setSubjects([]);
  };

  const assignedTeacherIds = replacementTarget
    ? assignments
        .filter(
          (assignment) =>
            assignment.subject.id === replacementTarget.subject.id &&
            assignment.teacher.id !== replacementTarget.teacher.id,
        )
        .map((assignment) => assignment.teacher.id)
    : [];

  const replacementOptions = teachers.filter((teacher) =>
    assignedTeacherIds.includes(teacher.teacher.id),
  );

  return (
    <div className="assignments-section">
      <div className="assignments-intro">
        <div>
          <h3>Asignaciones docentes</h3>
          <p>
            Administrá qué docentes están asignados a cada materia, curso y
            división.
          </p>
        </div>

        <span className="assignments-total">
          {assignments.length} asignaciones
        </span>
      </div>

      {error && <p className="assignments-error">{error}</p>}
      {success && <p className="assignments-success">{success}</p>}

      <section className="assignment-form-section">
        <h3>Nueva asignación</h3>

        <form className="assignment-form" onSubmit={handleSubmit}>
          <label htmlFor="assignment-teacher">Docente</label>
          <select
            id="assignment-teacher"
            value={teacherId}
            onChange={(e) => setTeacherId(e.target.value)}
            required>
            <option value="">Seleccionar docente</option>
            {teachers.map((teacher) => (
              <option key={teacher.teacher.id} value={teacher.teacher.id}>
                {teacher.firstName} {teacher.lastName} ({teacher.email})
              </option>
            ))}
          </select>

          <label htmlFor="assignment-year">Año lectivo</label>
          <select
            id="assignment-year"
            value={yearId}
            onChange={(e) => handleYearChange(e.target.value)}
            required>
            <option value="">Seleccionar año</option>
            {years.map((year) => (
              <option key={year.id} value={year.id}>
                {year.name}
              </option>
            ))}
          </select>

          <label htmlFor="assignment-course">Curso</label>
          <select
            id="assignment-course"
            value={courseId}
            onChange={(e) => handleCourseChange(e.target.value)}
            disabled={!yearId}
            required>
            <option value="">Seleccionar curso</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>

          <label htmlFor="assignment-division">División</label>
          <select
            id="assignment-division"
            value={divisionId}
            onChange={(e) => handleDivisionChange(e.target.value)}
            disabled={!courseId}
            required>
            <option value="">Seleccionar división</option>
            {divisions.map((division) => (
              <option key={division.id} value={division.id}>
                {division.name}
              </option>
            ))}
          </select>

          <label htmlFor="assignment-subject">Materia</label>
          <select
            id="assignment-subject"
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            disabled={!divisionId}
            required>
            <option value="">Seleccionar materia</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>

          <button type="submit" disabled={saving || !teachers.length}>
            {saving ? "Asignando..." : "Asignar docente"}
          </button>

          {teachers.length === 0 && <p>No hay docentes activos disponibles.</p>}
        </form>
      </section>

      <section className="assignments-list-section">
        <div className="assignments-list-heading">
          <h3>Asignaciones registradas</h3>
          <button type="button" onClick={loadAssignments}>
            Actualizar lista
          </button>
        </div>

        {loading ? (
          <p>Cargando asignaciones...</p>
        ) : assignments.length === 0 ? (
          <p>Todavía no hay asignaciones registradas.</p>
        ) : (
          <div className="assignments-list">
            {assignments.map((assignment) => (
              <article className="assignment-card" key={assignment.id}>
                <div className="assignment-teacher">
                  <div className="assignment-avatar">
                    {assignment.teacher.user.firstName?.charAt(0)}
                    {assignment.teacher.user.lastName?.charAt(0)}
                  </div>

                  <div>
                    <h4>
                      {assignment.teacher.user.firstName}{" "}
                      {assignment.teacher.user.lastName}
                    </h4>
                    <p>{assignment.teacher.user.email}</p>
                  </div>
                </div>

                <div className="assignment-details">
                  <span className="assignment-subject">
                    {assignment.subject.name}
                  </span>
                  <span>
                    {assignment.subject.division.course.name} · División{" "}
                    {assignment.subject.division.name}
                  </span>
                </div>

                <button
                  type="button"
                  className="assignment-delete-button"
                  onClick={() => handleDelete(assignment)}
                  disabled={deleting}>
                  Eliminar
                </button>
              </article>
            ))}
          </div>
        )}
      </section>

      {replacementTarget && (
        <div className="assignment-modal-overlay">
          <section
            className="assignment-replacement-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="replacement-title">
            <h3 id="replacement-title">Elegir docente reemplazante</h3>

            <p>
              Este docente tiene programas a su cargo en{" "}
              <strong>{replacementTarget.subject.name}</strong>. Para quitar su
              asignación, primero tenés que transferir esos programas a otro
              docente asignado a la misma materia.
            </p>

            <label htmlFor="replacement-teacher">Docente reemplazante</label>

            <select
              id="replacement-teacher"
              value={replacementTeacherId}
              onChange={(e) => setReplacementTeacherId(e.target.value)}>
              <option value="">Seleccionar docente</option>
              {replacementOptions.map((teacher) => (
                <option key={teacher.teacher.id} value={teacher.teacher.id}>
                  {teacher.firstName} {teacher.lastName}
                </option>
              ))}
            </select>

            {replacementOptions.length === 0 && (
              <p>
                No hay otros docentes asignados a esta materia. Primero asigná
                otro docente para poder transferir los programas.
              </p>
            )}

            <div className="assignment-modal-actions">
              <button
                type="button"
                onClick={handleCancelReplacement}
                disabled={deleting}>
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleConfirmReplacement}
                disabled={
                  deleting ||
                  !replacementTeacherId ||
                  replacementOptions.length === 0
                }>
                {deleting ? "Procesando..." : "Transferir y eliminar"}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default Assignments;
