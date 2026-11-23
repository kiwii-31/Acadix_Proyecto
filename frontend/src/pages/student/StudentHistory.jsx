import { useEffect, useState } from "react";
import { api } from "../../services/api.js";
import StudentTopics from "./StudentTopics.jsx";

function StudentHistory({ currentEnrollment }) {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedProgram, setSelectedProgram] = useState(null);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await api("/programs/student");
        setPrograms(data.programs);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  if (loading) {
    return <p>Cargando historial académico...</p>;
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

  const previousPrograms = currentEnrollment
    ? programs.filter(
        (program) =>
          program.subject.division.course.academicYear.id !==
          currentEnrollment.academicYearId,
      )
    : programs;

  const years = [
    ...new Set(
      previousPrograms.map(
        (program) => program.subject.division.course.academicYear.name,
      ),
    ),
  ].sort((a, b) => Number(b) - Number(a));

  if (previousPrograms.length === 0) {
    return (
      <div className="student-empty-state">
        <h3>Tu historial está vacío</h3>
        <p>
          Cuando tengas programas publicados de años anteriores, aparecerán acá.
        </p>
      </div>
    );
  }

  return (
    <div className="student-history">
      <div className="student-section-heading">
        <h2>Historial académico</h2>
        <p>Consultá los materiales de tus años anteriores.</p>
      </div>

      {years.map((year) => {
        const yearPrograms = previousPrograms.filter(
          (program) =>
            program.subject.division.course.academicYear.name === year,
        );

        return (
          <section className="student-history-year" key={year}>
            <h3>Año lectivo {year}</h3>

            <div className="student-program-list">
              {yearPrograms.map((program) => (
                <div className="student-program-item" key={program.id}>
                  <button
                    type="button"
                    className="student-program-button"
                    onClick={() => setSelectedProgram(program)}>
                    {program.title}
                  </button>

                  <span>{program.subject.name}</span>
                  <span>{program.period.name}</span>
                  <span>{program._count.topics} temas</span>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

export default StudentHistory;
