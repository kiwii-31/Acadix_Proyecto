import { useEffect, useState } from "react";
import { api } from "../../../services/api.js";
import "./AcademicPeriods.css";

function AcademicPeriods() {
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [periods, setPeriods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const loadYears = async () => {
      try {
        const data = await api("/academic-years");
        setYears(data.years);

        if (data.years.length > 0) {
          setSelectedYear(data.years[0].id);
        }
      } catch (err) {
        setError(err.message);
      }
    };

    loadYears();
  }, []);

  const loadPeriods = async (yearId) => {
    if (!yearId) {
      setPeriods([]);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await api(`/academic-periods?academicYearId=${yearId}`);
      setPeriods(data.periods);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePeriods = async () => {
    const confirmed = window.confirm(
      "¿Querés generar los dos cuatrimestres, los cuatro bimestres y el período de recuperatorio para este año lectivo?",
    );

    if (!confirmed) return;

    setGenerating(true);
    setError("");
    setMessage("");

    try {
      const data = await api("/academic-periods/generate", {
        method: "POST",
        body: JSON.stringify({
          academicYearId: selectedYear,
        }),
      });

      setMessage(data.message);
      await loadPeriods(selectedYear);
    } catch (err) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    loadPeriods(selectedYear);
  }, [selectedYear]);

  const handleStatusChange = async (period) => {
    const newStatus = period.status === "OPEN" ? "CLOSED" : "OPEN";

    setUpdatingId(period.id);
    setError("");
    setMessage("");

    try {
      const data = await api(`/academic-periods/${period.id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });

      setMessage(data.message || "Estado del período actualizado.");
      await loadPeriods(selectedYear);
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const cuatrimesters = periods.filter(
    (period) => period.type === "CUATRIMESTER",
  );

  const recovery = periods.find((period) => period.type === "RECOVERY");

  const renderStatus = (period) => (
    <span
      className={`period-status ${
        period.status === "OPEN" ? "open" : "closed"
      }`}>
      {period.status === "OPEN" ? "Abierto" : "Cerrado"}
    </span>
  );

  const renderPeriodCard = (period) => (
    <article className="period-card" key={period.id}>
      <div className="period-card-info">
        <div>
          <h4>{period.name}</h4>
          {renderStatus(period)}
        </div>

        <button
          type="button"
          className={period.status === "OPEN" ? "period-close" : "period-open"}
          onClick={() => handleStatusChange(period)}
          disabled={updatingId === period.id}>
          {updatingId === period.id
            ? "Actualizando..."
            : period.status === "OPEN"
              ? "Cerrar período"
              : "Abrir período"}
        </button>
      </div>
    </article>
  );

  return (
    <div className="academic-periods-section">
      <div className="periods-intro">
        <h3>Organización de períodos académicos</h3>
        <p>
          Administrá los cuatrimestres, bimestres y el período de recuperatorio
          de cada año lectivo.
        </p>
      </div>

      <div className="periods-filter">
        <label htmlFor="period-year">Año lectivo</label>
        <select
          id="period-year"
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

      {selectedYear && periods.length === 0 && !loading && (
        <button
          type="button"
          onClick={handleGeneratePeriods}
          disabled={generating}>
          {generating ? "Generando períodos..." : "Generar períodos"}
        </button>
      )}

      {error && <p className="periods-error">{error}</p>}

      {message && <p className="periods-success">{message}</p>}

      {loading ? (
        <p>Cargando períodos...</p>
      ) : periods.length === 0 ? (
        <p>Todavía no hay períodos registrados para este año.</p>
      ) : (
        <div className="periods-groups">
          {cuatrimesters.map((cuatrimestre) => (
            <section className="cuatrimestre-group" key={cuatrimestre.id}>
              <div className="cuatrimestre-heading">
                <div>
                  <span>CUATRIMESTRE</span>
                  <h3>{cuatrimestre.name}</h3>
                </div>
                {renderStatus(cuatrimestre)}
              </div>

              <div className="bimesters-list">
                {cuatrimestre.children
                  .filter((period) => period.type === "BIMESTER")
                  .map(renderPeriodCard)}
              </div>
            </section>
          ))}

          {recovery && (
            <section className="recovery-group">
              <div className="cuatrimestre-heading">
                <div>
                  <span>PERÍODO INDEPENDIENTE</span>
                  <h3>{recovery.name}</h3>
                </div>
                {renderStatus(recovery)}
              </div>

              {renderPeriodCard(recovery)}
            </section>
          )}
        </div>
      )}
    </div>
  );
}

export default AcademicPeriods;
