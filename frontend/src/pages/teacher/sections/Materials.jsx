import { useEffect, useState } from "react";
import { api } from "../../../services/api.js";

function Materials({ topic, onBack }) {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);

  const loadMaterials = async () => {
    try {
      const data = await api(`/materials/${topic.id}`);
      setMaterials(data.materials);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMaterials();
  }, [topic.id]);

  const handleUpload = async (event) => {
    event.preventDefault();

    if (!file) {
      setError("Seleccioná un archivo PDF.");
      return;
    }

    if (file.type !== "application/pdf") {
      setError("Solamente se permiten archivos PDF.");
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setError("El archivo no puede superar los 20 MB.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("file", file);

      const data = await api(`/materials/${topic.id}`, {
        method: "POST",
        body: formData,
      });

      setSuccess(data.message);
      setTitle("");
      setDescription("");
      setFile(null);

      event.target.reset();

      await loadMaterials();
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDownload = async (material) => {
    setError("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "/api"}/materials/${material.id}/download`,
        {
          credentials: "include",
        },
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "No se pudo descargar el archivo.");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = material.fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async (material) => {
    const confirmed = window.confirm(
      `¿Querés eliminar el material "${material.title}"?`,
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      const data = await api(`/materials/${material.id}`, {
        method: "DELETE",
      });

      setSuccess(data.message);
      await loadMaterials();
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) {
    return <p>Cargando materiales...</p>;
  }

  return (
    <div className="teacher-materials">
      <button
        type="button"
        className="teacher-button teacher-button-back"
        onClick={onBack}>
        ← Volver a temas
      </button>

      <div className="teacher-section-heading">
        <div>
          <h3>{topic.title}</h3>
          <p>Gestioná los materiales educativos de este tema.</p>
        </div>
      </div>

      {error && <p className="teacher-error">{error}</p>}
      {success && <p>{success}</p>}

      <form className="teacher-program-form" onSubmit={handleUpload}>
        <h4>Agregar material</h4>

        <label>Título</label>

        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
          placeholder="Ej. Guía de ejercicios"
        />

        <label>Descripción</label>

        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Descripción del material"
        />

        <label>Archivo PDF (máximo 20 MB)</label>

        <input
          className="teacher-file-input"
          type="file"
          accept="application/pdf,.pdf"
          onChange={(event) => setFile(event.target.files[0] || null)}
          required
        />

        <button
          type="submit"
          className="teacher-button teacher-button-primary"
          disabled={saving}>
          {saving ? "Subiendo..." : "Subir material"}
        </button>
      </form>

      <h4>Materiales del tema</h4>

      {materials.length === 0 ? (
        <div className="teacher-empty-state">
          <p>Todavía no hay materiales cargados.</p>
        </div>
      ) : (
        <div className="teacher-material-list">
          {materials.map((material) => (
            <article className="teacher-material-card" key={material.id}>
              <div>
                <h4>{material.title}</h4>

                {material.description && <p>{material.description}</p>}

                <span>{material.fileName}</span>

                <span>
                  {(material.sizeBytes / (1024 * 1024)).toFixed(2)} MB
                </span>
              </div>

              <div className="teacher-material-actions">
                <button
                  type="button"
                  className="teacher-button teacher-button-primary"
                  onClick={() => handleDownload(material)}>
                  Descargar
                </button>

                <button
                  type="button"
                  className="teacher-button teacher-button-danger"
                  onClick={() => handleDelete(material)}>
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

export default Materials;
