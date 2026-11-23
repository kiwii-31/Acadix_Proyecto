import { useEffect, useState } from "react";
import { api } from "../../../services/api.js";
import Materials from "./Materials.jsx";

function Topics({ program, onBack }) {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedTopic, setSelectedTopic] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
  });

  const loadTopics = async () => {
    try {
      const data = await api(`/topics/${program.id}`);
      setTopics(data.topics);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTopics();
  }, [program.id]);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (topic) => {
    setError("");
    setSuccess("");
    setEditingId(topic.id);

    setForm({
      title: topic.title,
      description: topic.description || "",
    });

    setShowForm(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const data = await api(
        editingId ? `/topics/${editingId}` : `/topics/${program.id}`,
        {
          method: editingId ? "PUT" : "POST",
          body: JSON.stringify(
            editingId
              ? form
              : {
                  ...form,
                  order: topics.length + 1,
                },
          ),
        },
      );

      setSuccess(data.message);
      resetForm();
      await loadTopics();
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (topic) => {
    const confirmed = window.confirm(
      `¿Estás seguro de que querés eliminar el tema "${topic.title}"? También se eliminarán sus materiales.`,
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      const data = await api(`/topics/${topic.id}`, {
        method: "DELETE",
      });

      setSuccess(data.message);
      await loadTopics();
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) {
    return <p>Cargando temas...</p>;
  }
  if (selectedTopic) {
    return (
      <Materials topic={selectedTopic} onBack={() => setSelectedTopic(null)} />
    );
  }

  return (
    <div className="teacher-topics">
      <button
        type="button"
        className="teacher-button teacher-button-back"
        onClick={onBack}>
        ← Volver a programas
      </button>

      <div className="teacher-section-heading">
        <div>
          <h3>{program.title}</h3>
          <p>Gestioná los temas de este programa.</p>
        </div>
        <button
          type="button"
          className="teacher-button teacher-button-primary"
          onClick={() => {
            if (showForm) {
              resetForm();
            } else {
              setError("");
              setSuccess("");
              setEditingId(null);
              setForm({
                title: "",
                description: "",
              });
              setShowForm(true);
            }
          }}>
          {showForm ? "Cancelar" : "Agregar tema"}
        </button>
      </div>
      {error && <p className="teacher-error">{error}</p>}
      {success && <p>{success}</p>}

      {showForm && (
        <form className="teacher-program-form" onSubmit={handleSubmit}>
          <label>Título del tema</label>

          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            placeholder="Ej. Números naturales"
          />

          <label>Descripción</label>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Descripción del tema"
          />
          <button
            type="submit"
            className="teacher-button teacher-button-primary"
            disabled={saving}>
            {saving
              ? "Guardando..."
              : editingId
                ? "Guardar cambios"
                : "Crear tema"}
          </button>
        </form>
      )}

      {topics.length === 0 ? (
        <div className="teacher-empty-state">
          <h4>Este programa todavía no tiene temas</h4>
          <p>Agregá el primer tema para comenzar a organizar los contenidos.</p>
        </div>
      ) : (
        <div className="teacher-topic-list">
          {topics.map((topic) => (
            <article className="teacher-topic-card" key={topic.id}>
              <div>
                <span>Tema {topic.order}</span>
                <h4>{topic.title}</h4>
                {topic.description && <p>{topic.description}</p>}
                <span>{topic._count?.materials ?? 0} materiales</span>
              </div>

              <div className="teacher-topic-actions">
                <button
                  type="button"
                  className="teacher-button teacher-button-secondary"
                  onClick={() => handleEdit(topic)}>
                  Editar
                </button>

                <button
                  type="button"
                  className="teacher-button teacher-button-primary"
                  onClick={() => setSelectedTopic(topic)}>
                  Ver materiales
                </button>

                <button
                  type="button"
                  className="teacher-button teacher-button-danger"
                  onClick={() => handleDelete(topic)}>
                  Eliminar
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default Topics;
