import { useState } from "react";
import { useAuth } from "./context/AuthContext.jsx";
import "./App.css";

import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import TeacherDashboard from "./pages/teacher/TeacherDashboard.jsx";
import StudentDashboard from "./pages/student/StudentDashboard.jsx";

function App() {
  const { user, loading, login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await login(email, password);
      setPassword("");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="login-page">
        <section className="login-card">
          <h1>ACADIX</h1>
          <p>Comprobando sesión...</p>
        </section>
      </main>
    );
  }

  if (user) {
    if (user.role === "ADMIN") {
      return <AdminDashboard />;
    }

    if (user.role === "TEACHER") {
      return <TeacherDashboard />;
    }

    if (user.role === "STUDENT") {
      return <StudentDashboard />;
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-brand">
          <div className="login-logo">A</div>
          <h1>ACADIX</h1>
          <p>Tu espacio de aprendizaje</p>
        </div>

        <div className="login-heading">
          <h2>¡Hola de nuevo!</h2>
          <p>Ingresá a tu cuenta para continuar.</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              placeholder="nombre@ejemplo.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              placeholder="Ingresá tu contraseña"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          {error && <p className="login-error">{error}</p>}

          <button type="submit" disabled={submitting}>
            {submitting ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>

        <p className="login-footer">ACADIX · Plataforma educativa</p>
      </section>
    </main>
  );
}

export default App;
