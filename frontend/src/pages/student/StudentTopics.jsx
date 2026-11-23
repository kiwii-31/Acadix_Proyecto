import { useEffect, useState } from "react";
import { api } from "../../services/api.js";
import StudentMaterials from "./StudentMaterials.jsx";

function StudentTopics({ program, onBack }) {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTopic, setSelectedTopic] = useState(null);

  useEffect(() => {
    const loadTopics = async () => {
      try {
        const data = await api(`/topics/student/${program.id}`);
        setTopics(data.topics);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadTopics();
  }, [program.id]);

  if (loading) return <p>Cargando temas...</p>;

  if (selectedTopic) {
    return (
      <StudentMaterials
        topic={selectedTopic}
        onBack={() => setSelectedTopic(null)}
      />
    );
  }

  return (
    <div className="student-topics">
      <button type="button" onClick={onBack}>
        Volver a mis materias
      </button>

      <div className="student-section-heading">
        <h2>{program.title}</h2>
        <p>
          {program.subject.name} · {program.period.name}
        </p>
      </div>

      {error && <p className="student-error">{error}</p>}

      {!error && topics.length === 0 && (
        <div className="student-empty-state">
          <h3>Todavía no hay temas disponibles</h3>
          <p>Cuando se agreguen temas al programa, aparecerán acá.</p>
        </div>
      )}

      {topics.length > 0 && (
        <div className="student-topic-list">
          {topics.map((topic) => (
            <article className="student-topic-card" key={topic.id}>
              <h3>
                {topic.order}. {topic.title}
              </h3>

              {topic.description && <p>{topic.description}</p>}

              <span>{topic._count.materials} material(es)</span>

              <button
                type="button"
                className="student-program-button"
                onClick={() => setSelectedTopic(topic)}>
                Ver materiales
              </button>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default StudentTopics;
