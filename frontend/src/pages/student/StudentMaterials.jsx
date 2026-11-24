import { useEffect, useState } from "react";
import { api } from "../../services/api.js";

function StudentMaterials({ topic, onBack }) {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadMaterials = async () => {
      try {
        const data = await api(`/materials/student/${topic.id}`);
        setMaterials(data.materials);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadMaterials();
  }, [topic.id]);

  const handleDownload = async (material) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "/api"}/materials/student/${material.id}/download`,
        { credentials: "include" },
      );

      if (!response.ok) {
        throw new Error("No se pudo descargar el archivo.");
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

  if (loading) return <p>Cargando materiales...</p>;

  return (
    <div className="student-materials">
      <button type="button" onClick={onBack}>
        Volver a los temas
      </button>

      <div className="student-section-heading">
        <h2>{topic.title}</h2>
        <p>Materiales educativos disponibles</p>
      </div>

      {error && <p className="student-error">{error}</p>}

      {!error && materials.length === 0 && (
        <div className="student-empty-state">
          <h3>Todavía no hay materiales disponibles</h3>
          <p>Cuando se agreguen archivos, aparecerán acá.</p>
        </div>
      )}

      {materials.length > 0 && (
        <div className="student-material-list">
          {materials.map((material) => (
            <article className="student-material-card" key={material.id}>
              <div>
                <h3>{material.title}</h3>

                {material.description && <p>{material.description}</p>}

                <span>{material.fileName}</span>
              </div>

              <button type="button" onClick={() => handleDownload(material)}>
                Descargar PDF
              </button>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default StudentMaterials;
