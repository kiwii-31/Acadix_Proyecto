import { useEffect, useState } from "react";
import { api } from "../../../services/api.js";

function MySubjects() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSubjects = async () => {
      try {
        const data = await api("/assignments/my");
        setSubjects(data.assignments);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadSubjects();
  }, []);

  if (loading) {
    return <p>Cargando tus materias...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="teacher-subjects">
      <div className="teacher-section-heading">
        <div>
          <h3>Mis materias</h3>
          <p>Materias que tenés asignadas en ACADIX.</p>
        </div>
        <span>{subjects.length} materias</span>
      </div>

      {subjects.length === 0 ? (
        <div className="teacher-empty-state">
          <h4>No tenés materias asignadas</h4>
          <p>Cuando el administrador te asigne una materia, aparecerá acá.</p>
        </div>
      ) : (
        <div className="teacher-subject-grid">
          {subjects.map((assignment) => {
            const subject = assignment.subject;
            const division = subject.division;
            const course = division.course;
            const academicYear = course.academicYear;

            return (
              <article className="teacher-subject-card" key={assignment.id}>
                <h4>{subject.name}</h4>

                <p>
                  {course.name} año · División {division.name}
                </p>

                <span>Año lectivo {academicYear.name}</span>

                <div className="teacher-subject-card-footer">
                  <span>{subject._count.programs} programas</span>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MySubjects;
