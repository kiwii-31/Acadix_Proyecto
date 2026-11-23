
import { useEffect, useState } from "react";
import { api } from "../../../services/api.js";
import "./AcademicYears.css";

function formatDate(date) {
  if (!date) return "Sin especificar";

  const [year, month, day] = date.slice(0, 10).split("-");
  return `${day}/${month}/${year}`;
}

function AcademicYears() {
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    startDate: "",
    endDate: "",
  });

  const loadYears = async () => {
    try {
      setError("");
      const data = await api("/academic-years");
      setYears(data.years);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadYears();
  }, []);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const resetForm = () => {
    setForm({
      name: "",
      startDate: "",
      endDate: "",
    });
    setEditingId(null);
  };

  const handleEdit = (year) => {
    setForm({
      name: year.name,
      startDate: year.startDate?.slice(0, 10) || "",
      endDate: year.endDate?.slice(0, 10) || "",
    });

    setEditingId(year.id);
    setMessage("");
    setError("");

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const endpoint = editingId
        ? `/academic-years/${editingId}`
        : "/academic-years";

      const data = await api(endpoint, {
        method: editingId ? "PUT" : "POST",
        body: JSON.stringify({
          name: form.name,
          startDate: form.startDate || null,
          endDate: form.endDate || null,
        }),
      });

      setMessage(data.message);
      resetForm();
      await loadYears();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="academic-years">
      <div className="years-intro">
        <div>
          <h3>Organización del ciclo lectivo</h3>
          <p>
            Administrá los años académicos de la institución,
            sus fechas y los cursos asociados.
          </p>
        </div>

        <span className="years-total">
          {years.length} {years.length === 1 ? "año" : "años"}
        </span>
      </div>

      <section className="year-form-card">
        <h3>{editingId ? "Modificar año lectivo" : "Nuevo año lectivo"}</h3>

        <form onSubmit={handleSubmit}>
          <div className="year-form-grid">
            <div className="year-field">
              <label htmlFor="year-name">Nombre del año</label>
              <input
                id="year-name"
                name="name"
                type="text"
                placeholder="Ej. 2028"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="year-field">
              <label htmlFor="year-start">Fecha de inicio</label>
              <input
                id="year-start"
                name="startDate"
                type="date"
                value={form.startDate}
                onChange={handleChange}
              />
            </div>

            <div className="year-field">
              <label htmlFor="year-end">Fecha de finalización</label>
              <input
                id="year-end"
                name="endDate"
                type="date"
                value={form.endDate}
                onChange={handleChange}
              />
            </div>
          </div>

          {error && <p className="years-error">{error}</p>}
          {message && <p className="years-success">{message}</p>}

          <div className="year-form-actions">
            {editingId && (
              <button
                type="button"
                className="year-cancel"
                onClick={resetForm}
              >
                Cancelar
              </button>
            )}

            <button type="submit" className="year-submit" disabled={saving}>
              {saving
                ? "Guardando..."
                : editingId
                  ? "Guardar cambios"
                  : "Crear año lectivo"}
            </button>
          </div>
        </form>
      </section>

      <section className="years-list-section">
        <div className="years-list-heading">
          <h3>Años lectivos registrados</h3>
          <button type="button" onClick={loadYears}>
            Actualizar lista
          </button>
        </div>

        {loading ? (
          <p className="years-empty">Cargando años lectivos...</p>
        ) : years.length === 0 ? (
          <p className="years-empty">
            Todavía no hay años lectivos registrados.
          </p>
        ) : (
          <div className="years-list">
            {years.map((year) => (
              <article className="year-card" key={year.id}>
                <div className="year-card-main">
                  <div className="year-icon">▦</div>

                  <div>
                    <h4>{year.name}</h4>
                    <p>
                      {formatDate(year.startDate)} — {formatDate(year.endDate)}
                    </p>
                  </div>
                </div>

                <div className="year-card-info">
                  <span>{year._count.courses} cursos</span>
                  <span>{year._count.enrollments} inscripciones</span>
                </div>

                <button
                  type="button"
                  className="year-edit"
                  onClick={() => handleEdit(year)}
                >
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

export default AcademicYears;
