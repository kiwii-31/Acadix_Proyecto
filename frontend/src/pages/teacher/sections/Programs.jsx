import { useEffect, useState } from "react";
import { api } from "../../../services/api.js";
import Topics from "./Topics.jsx";

function Programs() {
  const [programs, setPrograms] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [periods, setPeriods] = useState([]);

  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    subjectId: "",
    periodId: "",
  });

  const loadPrograms = async () => {
    try {
      const data = await api("/programs");
      setPrograms(data.programs);
    } catch (error) {
      setError(error.message);
    }
  };

  const loadFormData = async () => {
    try {
      const assignmentsData = await api("/assignments/my");

      const assignedSubjects = assignmentsData.assignments.map(
        (assignment) => assignment.subject,
      );

      setSubjects(assignedSubjects);

      const yearIds = [
        ...new Set(
          assignedSubjects.map(
            (subject) => subject.division.course.academicYearId,
          ),
        ),
      ];

      const periodsData = await Promise.all(
        yearIds.map((yearId) =>
          api(`/academic-periods/open?academicYearId=${yearId}`),
        ),
      );

      const availablePeriods = periodsData.flatMap((data) => data.periods);

      setPeriods(availablePeriods);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([loadPrograms(), loadFormData()]);
      setLoading(false);
    };

    loadData();
  }, []);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleEdit = (program) => {
    setError("");
    setSuccess("");

    setEditingId(program.id);

    setForm({
      title: program.title,
      description: program.description || "",
      subjectId: program.subjectId,
      periodId: program.periodId,
    });

    setShowForm(true);
  };

  const handlePublish = async (program) => {
    const confirmed = window.confirm(
      `¿Querés publicar el programa "${program.title}"? Los estudiantes podrán consultar sus contenidos.`,
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      const data = await api(`/programs/${program.id}/publish`, {
        method: "PATCH",
      });

      setSuccess(data.message);
      await loadPrograms();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    setError("");

    setForm({
      title: "",
      description: "",
      subjectId: "",
      periodId: "",
    });
  };

  const handleCreate = async (event) => {
    event.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const data = await api(
        editingId ? `/programs/${editingId}` : "/programs",
        {
          method: editingId ? "PUT" : "POST",
          body: JSON.stringify(
            editingId
              ? {
                  title: form.title,
                  description: form.description,
                }
              : form,
          ),
        },
      );

      setSuccess(data.message);

      setForm({
        title: "",
        description: "",
        subjectId: "",
        periodId: "",
      });

      setShowForm(false);
      setEditingId(null);

      await loadPrograms();
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p>Cargando programas...</p>;
  }

  if (selectedProgram) {
    return (
      <Topics
        program={selectedProgram}
        onBack={() => setSelectedProgram(null)}
      />
    );
  }

  return (
    <div className="teacher-programs">
      <div className="teacher-section-heading">
        <div>
          <h3>Programas</h3>
          <p>Administrá los programas de tus materias asignadas.</p>
        </div>

        <button
          onClick={() => {
            if (showForm) {
              handleCancelForm();
            } else {
              setShowForm(true);
              setEditingId(null);
              setError("");
              setSuccess("");
              setForm({
                title: "",
                description: "",
                subjectId: "",
                periodId: "",
              });
            }
          }}>
          {showForm ? "Cancelar" : "Crear programa"}
        </button>
      </div>

      {error && <p className="teacher-error">{error}</p>}
      {success && <p>{success}</p>}

      {showForm && (
        <form className="teacher-program-form" onSubmit={handleCreate}>
          <label>Título</label>

          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            placeholder="Ej. Programa de Matemática"
          />

          <label>Descripción</label>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Descripción del programa"
          />

          {!editingId && (
            <>
              <label>Materia</label>

              <select
                name="subjectId"
                value={form.subjectId}
                onChange={handleChange}
                required>
                <option value="">Seleccioná una materia</option>

                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name} - {subject.division.course.name} año,
                    división {subject.division.name}
                  </option>
                ))}
              </select>

              <label>Período académico</label>

              <select
                name="periodId"
                value={form.periodId}
                onChange={handleChange}
                required>
                <option value="">Seleccioná un período abierto</option>

                {periods.map((period) => (
                  <option key={period.id} value={period.id}>
                    {period.name}
                  </option>
                ))}
              </select>
            </>
          )}

          <button type="submit" disabled={saving}>
            {saving
              ? "Guardando..."
              : editingId
                ? "Guardar cambios"
                : "Guardar como borrador"}
          </button>
        </form>
      )}

      {programs.length === 0 ? (
        <div className="teacher-empty-state">
          <h4>Todavía no tenés programas</h4>
          <p>Cuando crees un programa, aparecerá en esta sección.</p>
        </div>
      ) : (
        <div className="teacher-program-list">
          {programs.map((program) => (
            <article className="teacher-program-card" key={program.id}>
              <div>
                <h4>{program.title}</h4>

                <p>{program.subject.name}</p>

                <span>
                  {program.subject.division.course.name} año · División{" "}
                  {program.subject.division.name}
                </span>

                <span>{program.period.name}</span>
              </div>

              <div className="teacher-program-details">
                <span
                  className={`teacher-program-status ${program.status.toLowerCase()}`}>
                  {program.status === "PUBLISHED" ? "Publicado" : "Borrador"}
                </span>

                <span>{program._count.topics} temas</span>

                <button
                  type="button"
                  className="teacher-button teacher-button-secondary"
                  onClick={() => handleEdit(program)}>
                  Editar
                </button>

                <button
                  type="button"
                  className="teacher-button teacher-button-primary"
                  onClick={() => setSelectedProgram(program)}>
                  Ver temas
                </button>
                {program.status === "DRAFT" && (
                  <button
                    type="button"
                    className="teacher-button teacher-button-primary"
                    onClick={() => handlePublish(program)}>
                    Publicar
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default Programs;
