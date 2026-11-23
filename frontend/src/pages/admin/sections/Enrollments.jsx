import { useEffect, useState } from "react";
import { api } from "../../../services/api.js";
import "./Enrollments.css";

function Enrollments() {
  const [years, setYears] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [enrollments, setEnrollments] = useState([]);

  const [selectedYear, setSelectedYear] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editDivisionId, setEditDivisionId] = useState("");
  const [editDivisions, setEditDivisions] = useState([]);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [yearsData, usersData] = await Promise.all([
          api("/academic-years"),
          api("/users"),
        ]);

        setYears(yearsData.years);
        setStudents(
          usersData.users.filter(
            (user) => user.role === "STUDENT" && user.isActive && user.student,
          ),
        );

        if (yearsData.years.length > 0) {
          setSelectedYear(yearsData.years[0].id);
        }
      } catch (err) {
        setError(err.message);
      }
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    if (!selectedYear) {
      setCourses([]);
      setEnrollments([]);
      return;
    }

    const loadYearData = async () => {
      setLoading(true);
      setError("");

      try {
        const [coursesData, enrollmentsData] = await Promise.all([
          api(`/courses?academicYearId=${selectedYear}`),
          api(`/enrollments?academicYearId=${selectedYear}`),
        ]);

        setCourses(coursesData.courses);
        setEnrollments(enrollmentsData.enrollments);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadYearData();
  }, [selectedYear]);

  useEffect(() => {
    if (!selectedCourse) {
      setDivisions([]);
      setSelectedDivision("");
      return;
    }

    const loadDivisions = async () => {
      try {
        const data = await api(`/divisions?courseId=${selectedCourse}`);
        setDivisions(data.divisions);
        setSelectedDivision("");
      } catch (err) {
        setError(err.message);
      }
    };

    loadDivisions();
  }, [selectedCourse]);

  const handleEdit = async (enrollment) => {
    setError("");
    setMessage("");

    try {
      const courseId = enrollment.division.course.id;
      const data = await api(`/divisions?courseId=${courseId}`);

      setEditDivisions(data.divisions);
      setEditDivisionId(enrollment.division.id);
      setEditingId(enrollment.id);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditDivisionId("");
    setEditDivisions([]);
  };

  const handleUpdateDivision = async () => {
    if (!editDivisionId) {
      setError("Seleccioná una división.");
      return;
    }

    setUpdating(true);
    setError("");
    setMessage("");

    try {
      const data = await api(`/enrollments/${editingId}`, {
        method: "PUT",
        body: JSON.stringify({
          divisionId: editDivisionId,
        }),
      });

      setMessage(data.message || "División actualizada correctamente.");

      const updated = await api(`/enrollments?academicYearId=${selectedYear}`);

      setEnrollments(updated.enrollments);
      handleCancelEdit();
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!selectedStudent || !selectedYear || !selectedDivision) {
      setError("Completá todos los campos.");
      return;
    }

    setSaving(true);

    try {
      const data = await api("/enrollments", {
        method: "POST",
        body: JSON.stringify({
          studentId: selectedStudent,
          academicYearId: selectedYear,
          divisionId: selectedDivision,
        }),
      });

      setMessage(data.message || "Inscripción creada correctamente.");
      setSelectedStudent("");
      setSelectedCourse("");
      setSelectedDivision("");

      const updated = await api(`/enrollments?academicYearId=${selectedYear}`);
      setEnrollments(updated.enrollments);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="enrollments-section">
      <div className="enrollments-intro">
        <h3>Inscripciones de estudiantes</h3>
        <p>
          Administrá las inscripciones de los estudiantes en cada año lectivo.
        </p>
      </div>

      <div className="enrollments-filter">
        <label htmlFor="enrollment-year">Año lectivo</label>
        <select
          id="enrollment-year"
          value={selectedYear}
          onChange={(event) => setSelectedYear(event.target.value)}>
          <option value="">Seleccioná un año</option>
          {years.map((year) => (
            <option key={year.id} value={year.id}>
              {year.name}
            </option>
          ))}
        </select>
      </div>

      <form className="enrollment-form" onSubmit={handleSubmit}>
        <h4>Nueva inscripción</h4>

        <div className="enrollment-fields">
          <div>
            <label htmlFor="enrollment-student">Estudiante</label>
            <select
              id="enrollment-student"
              value={selectedStudent}
              onChange={(event) => setSelectedStudent(event.target.value)}
              required>
              <option value="">Seleccioná un estudiante</option>
              {students.map((student) => (
                <option key={student.student.id} value={student.student.id}>
                  {student.lastName}, {student.firstName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="enrollment-course">Curso</label>
            <select
              id="enrollment-course"
              value={selectedCourse}
              onChange={(event) => setSelectedCourse(event.target.value)}
              required>
              <option value="">Seleccioná un curso</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="enrollment-division">División</label>
            <select
              id="enrollment-division"
              value={selectedDivision}
              onChange={(event) => setSelectedDivision(event.target.value)}
              disabled={!selectedCourse}
              required>
              <option value="">Seleccioná una división</option>
              {divisions.map((division) => (
                <option key={division.id} value={division.id}>
                  {division.name}.ª
                </option>
              ))}
            </select>
          </div>
        </div>

        <button type="submit" disabled={saving}>
          {saving ? "Inscribiendo..." : "Inscribir estudiante"}
        </button>
      </form>

      {error && <p className="enrollments-error">{error}</p>}
      {message && <p className="enrollments-success">{message}</p>}

      <div className="enrollments-list">
        <div className="enrollments-list-heading">
          <h4>Estudiantes inscriptos</h4>
          <span>{enrollments.length} inscripciones</span>
        </div>

        {loading ? (
          <p>Cargando inscripciones...</p>
        ) : enrollments.length === 0 ? (
          <p>Todavía no hay estudiantes inscriptos en este año.</p>
        ) : (
          <div className="enrollments-table-wrapper">
            <table className="enrollments-table">
              <thead>
                <tr>
                  <th>Estudiante</th>
                  <th>Curso</th>
                  <th>División</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {enrollments.map((enrollment) => (
                  <tr key={enrollment.id}>
                    <td>
                      {enrollment.student.user.lastName},{" "}
                      {enrollment.student.user.firstName}
                    </td>
                    <td>{enrollment.division.course.name}</td>
                    <td>
                      {editingId === enrollment.id ? (
                        <select
                          value={editDivisionId}
                          onChange={(event) =>
                            setEditDivisionId(event.target.value)
                          }>
                          {editDivisions.map((division) => (
                            <option key={division.id} value={division.id}>
                              {division.name}.ª
                            </option>
                          ))}
                        </select>
                      ) : (
                        `${enrollment.division.name}.ª`
                      )}
                    </td>
                    <td>
                      {editingId === enrollment.id ? (
                        <div className="enrollment-actions">
                          <button
                            type="button"
                            onClick={handleUpdateDivision}
                            disabled={updating}>
                            {updating ? "Guardando..." : "Guardar"}
                          </button>
                          <button
                            type="button"
                            className="enrollment-cancel"
                            onClick={handleCancelEdit}
                            disabled={updating}>
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="enrollment-edit"
                          onClick={() => handleEdit(enrollment)}>
                          Cambiar división
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Enrollments;
