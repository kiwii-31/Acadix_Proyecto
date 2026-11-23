import { useEffect, useState } from "react";
import { api } from "../../services/api.js";
import StudentTopics from "./StudentTopics.jsx";

function StudentSubjects({ currentEnrollment }) {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedProgram, setSelectedProgram] = useState(null);

  useEffect(() => {
    const loadPrograms = async () => {
      try {
        const data = await api("/programs/student");
        setPrograms(data.programs);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadPrograms();
  }, []);

  if (loading) {
    return <p>Cargando materias...</p>;
  }

  if (error) {
    return <p className="student-error">{error}</p>;
  }

  if (selectedProgram) {
    return (
      <StudentTopics
        program={selectedProgram}
        onBack={() => setSelectedProgram(null)}
      />
    );
  }

  const currentPrograms = currentEnrollment
    ? programs.filter(
        (program) =>
          program.subject.divisionId === currentEnrollment.divisionId &&
          program.subject.division.course.academicYear.id ===
            currentEnrollment.academicYearId,
      )
    : [];

  const subjects = [
    ...new Map(
      currentPrograms.map((program) => [program.subject.id, program.subject]),
    ).values(),
  ];

  if (subjects.length === 0) {
    return (
      <div className="student-empty-state">
        <h3>Todavía no hay materias disponibles</h3>
        <p>Cuando tus docentes publiquen programas, aparecerán acá.</p>
      </div>
    );
  }

  return (
    <div className="student-subjects">
      <div className="student-section-heading">
        <h2>Mis materias</h2>
        <p>Materias con programas publicados disponibles para consultar.</p>
      </div>

      <div className="student-subject-grid">
        {subjects.map((subject) => {
          const subjectPrograms = currentPrograms.filter(
            (program) => program.subject.id === subject.id,
          );

          return (
            <article className="student-subject-card" key={subject.id}>
              <h3>{subject.name}</h3>

              <p>
                {subject.division.course.name} año · División{" "}
                {subject.division.name}
              </p>

              <span>
                {subjectPrograms.length}{" "}
                {subjectPrograms.length === 1 ? "programa" : "programas"}
              </span>

              <div className="student-program-list">
                {subjectPrograms.map((program) => (
                  <div className="student-program-item" key={program.id}>
                    <button
                      type="button"
                      className="student-program-button"
                      onClick={() => setSelectedProgram(program)}>
                      {program.title}
                    </button>

                    <span>{program.period.name}</span>
                    <span>{program._count.topics} temas</span>
                  </div>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

export default StudentSubjects;
