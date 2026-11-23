import { useEffect, useState } from "react";
import { api } from "../../../services/api.js";
import "./Users.css";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "STUDENT",
  });

  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [updating, setUpdating] = useState(false);
  const [passwordUser, setPasswordUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [resettingPassword, setResettingPassword] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await api("/users");
      setUsers(data.users);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleFormChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleCreateUser = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");
    setSaving(true);

    try {
      const data = await api("/users", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: form.email.trim(),
        }),
      });

      setMessage(data.message || "Usuario creado correctamente.");

      setForm({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "STUDENT",
      });

      setShowForm(false);
      await loadUsers();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (user) => {
    const newStatus = !user.isActive;

    const confirmed = window.confirm(
      newStatus
        ? `¿Querés activar la cuenta de ${user.firstName} ${user.lastName}?`
        : `¿Querés desactivar la cuenta de ${user.firstName} ${user.lastName}? El usuario perderá el acceso a ACADIX.`,
    );

    if (!confirmed) return;

    setError("");
    setMessage("");

    try {
      const data = await api(`/users/${user.id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ isActive: newStatus }),
      });

      setMessage(data.message || "Estado de la cuenta actualizado.");
      await loadUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);

    setEditForm({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    });

    setError("");
    setMessage("");
  };

  const handleEditChange = (event) => {
    setEditForm({
      ...editForm,
      [event.target.name]: event.target.value,
    });
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditForm({
      firstName: "",
      lastName: "",
      email: "",
    });
  };

  const handleUpdateUser = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");
    setUpdating(true);

    try {
      const data = await api(`/users/${editingUser.id}`, {
        method: "PUT",
        body: JSON.stringify({
          ...editForm,
          firstName: editForm.firstName.trim(),
          lastName: editForm.lastName.trim(),
          email: editForm.email.trim(),
        }),
      });

      setMessage(data.message || "Usuario actualizado correctamente.");
      handleCancelEdit();
      await loadUsers();
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();

    const confirmed = window.confirm(
      `¿Querés restablecer la contraseña de ${passwordUser.firstName} ${passwordUser.lastName}? Se cerrarán todas sus sesiones activas.`,
    );

    if (!confirmed) return;

    setError("");
    setMessage("");
    setResettingPassword(true);

    try {
      const data = await api(`/users/${passwordUser.id}/password`, {
        method: "PATCH",
        body: JSON.stringify({ password: newPassword }),
      });

      setMessage(data.message || "Contraseña restablecida correctamente.");
      setPasswordUser(null);
      setNewPassword("");
    } catch (err) {
      setError(err.message);
    } finally {
      setResettingPassword(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesRole = roleFilter === "ALL" || user.role === roleFilter;

    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "ACTIVE" && user.isActive) ||
      (statusFilter === "INACTIVE" && !user.isActive);

    return matchesRole && matchesStatus;
  });

  const roleNames = {
    ADMIN: "Administrador",
    TEACHER: "Docente",
    STUDENT: "Estudiante",
  };

  return (
    <div className="users-section">
      <div className="users-intro">
        <h3>Gestión de usuarios</h3>
        <p>
          Administrá las cuentas de estudiantes, docentes y administradores.
        </p>
      </div>

      <div className="users-toolbar">
        <div className="users-filters">
          <div>
            <label htmlFor="user-role-filter">Rol</label>
            <select
              id="user-role-filter"
              value={roleFilter}
              onChange={(event) => setRoleFilter(event.target.value)}>
              <option value="ALL">Todos los roles</option>
              <option value="ADMIN">Administradores</option>
              <option value="TEACHER">Docentes</option>
              <option value="STUDENT">Estudiantes</option>
            </select>
          </div>

          <div>
            <label htmlFor="user-status-filter">Estado</label>
            <select
              id="user-status-filter"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}>
              <option value="ALL">Todos los estados</option>
              <option value="ACTIVE">Activos</option>
              <option value="INACTIVE">Inactivos</option>
            </select>
          </div>
        </div>

        <button
          type="button"
          className="user-create-button"
          disabled={saving}
          onClick={() => {
            setShowForm(!showForm);
            setError("");
            setMessage("");
          }}>
          {showForm ? "Cancelar" : "+ Crear usuario"}
        </button>
      </div>

      {showForm && (
        <form className="user-form" onSubmit={handleCreateUser}>
          <h4>Crear cuenta</h4>

          <div className="user-form-grid">
            <div>
              <label htmlFor="user-first-name">Nombre</label>
              <input
                id="user-first-name"
                name="firstName"
                value={form.firstName}
                onChange={handleFormChange}
                required
              />
            </div>

            <div>
              <label htmlFor="user-last-name">Apellido</label>
              <input
                id="user-last-name"
                name="lastName"
                value={form.lastName}
                onChange={handleFormChange}
                required
              />
            </div>

            <div>
              <label htmlFor="user-email">Correo electrónico</label>
              <input
                id="user-email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleFormChange}
                required
              />
            </div>

            <div>
              <label htmlFor="user-password">Contraseña inicial</label>
              <input
                id="user-password"
                name="password"
                type="password"
                minLength={12}
                value={form.password}
                onChange={handleFormChange}
                required
              />
              <small>Mínimo 12 caracteres.</small>
            </div>

            <div>
              <label htmlFor="user-role">Rol</label>
              <select
                id="user-role"
                name="role"
                value={form.role}
                onChange={handleFormChange}>
                <option value="STUDENT">Estudiante</option>
                <option value="TEACHER">Docente</option>
                <option value="ADMIN">Administrador</option>
              </select>
            </div>
          </div>

          <button type="submit" disabled={saving}>
            {saving ? "Creando..." : "Crear cuenta"}
          </button>
        </form>
      )}

      {editingUser && (
        <form className="user-form" onSubmit={handleUpdateUser}>
          <h4>Editar usuario</h4>

          <div className="user-form-grid">
            <div>
              <label htmlFor="edit-first-name">Nombre</label>
              <input
                id="edit-first-name"
                name="firstName"
                value={editForm.firstName}
                onChange={handleEditChange}
                required
              />
            </div>

            <div>
              <label htmlFor="edit-last-name">Apellido</label>
              <input
                id="edit-last-name"
                name="lastName"
                value={editForm.lastName}
                onChange={handleEditChange}
                required
              />
            </div>

            <div>
              <label htmlFor="edit-email">Correo electrónico</label>
              <input
                id="edit-email"
                name="email"
                type="email"
                value={editForm.email}
                onChange={handleEditChange}
                required
              />
            </div>
          </div>

          <div className="user-edit-actions">
            <button type="submit" disabled={updating}>
              {updating ? "Guardando..." : "Guardar cambios"}
            </button>

            <button
              type="button"
              className="user-cancel-button"
              onClick={handleCancelEdit}
              disabled={updating}>
              Cancelar
            </button>
          </div>
        </form>
      )}

      {passwordUser && (
        <form className="user-form" onSubmit={handleResetPassword}>
          <h4>Restablecer contraseña</h4>

          <p>
            Nueva contraseña para{" "}
            <strong>
              {passwordUser.firstName} {passwordUser.lastName}
            </strong>
          </p>

          <div className="user-form-grid">
            <div>
              <label htmlFor="new-user-password">Nueva contraseña</label>

              <input
                id="new-user-password"
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                minLength={12}
                required
              />

              <small>Mínimo 12 caracteres.</small>
            </div>
          </div>

          <div className="user-edit-actions">
            <button type="submit" disabled={resettingPassword}>
              {resettingPassword ? "Guardando..." : "Restablecer contraseña"}
            </button>

            <button
              type="button"
              className="user-cancel-button"
              onClick={() => {
                setPasswordUser(null);
                setNewPassword("");
              }}
              disabled={resettingPassword}>
              Cancelar
            </button>
          </div>
        </form>
      )}

      {error && <p className="users-error">{error}</p>}
      {message && <p className="users-success">{message}</p>}

      <div className="users-list">
        <div className="users-list-heading">
          <h4>Usuarios registrados</h4>
          <span>{filteredUsers.length} usuarios</span>
        </div>

        {loading ? (
          <p>Cargando usuarios...</p>
        ) : filteredUsers.length === 0 ? (
          <p>No se encontraron usuarios con esos filtros.</p>
        ) : (
          <div className="users-table-wrapper">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Correo electrónico</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      {user.lastName}, {user.firstName}
                    </td>
                    <td>{user.email}</td>
                    <td>{roleNames[user.role]}</td>
                    <td>
                      <span
                        className={`user-status ${
                          user.isActive ? "active" : "inactive"
                        }`}>
                        {user.isActive ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td>
                      <div className="user-actions">
                        <button
                          type="button"
                          className="user-edit-button"
                          onClick={() => handleEdit(user)}>
                          Editar
                        </button>

                        <button
                          type="button"
                          className="user-password-button"
                          onClick={() => {
                            setPasswordUser(user);
                            setNewPassword("");
                            setError("");
                            setMessage("");
                          }}>
                          Restablecer contraseña
                        </button>

                        <button
                          type="button"
                          className={
                            user.isActive
                              ? "user-disable-button"
                              : "user-enable-button"
                          }
                          onClick={() => handleStatusChange(user)}>
                          {user.isActive ? "Desactivar" : "Activar"}
                        </button>
                      </div>
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

export default Users;
