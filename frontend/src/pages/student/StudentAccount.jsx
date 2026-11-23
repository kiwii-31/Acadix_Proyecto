function StudentAccount({ user }) {
  return (
    <div className="student-account">
      <div className="student-section-heading">
        <h2>Mi cuenta</h2>
        <p>Información de tu cuenta de ACADIX.</p>
      </div>

      <div className="student-account-card">
        <div className="student-account-avatar">
          {user.firstName?.charAt(0).toUpperCase()}
        </div>

        <h3>
          {user.firstName} {user.lastName}
        </h3>

        <span>Estudiante</span>

        <div className="student-account-details">
          <div>
            <label>Nombre</label>
            <p>{user.firstName}</p>
          </div>

          <div>
            <label>Apellido</label>
            <p>{user.lastName}</p>
          </div>

          <div>
            <label>Correo electrónico</label>
            <p>{user.email}</p>
          </div>

          <div>
            <label>Tipo de cuenta</label>
            <p>Estudiante</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentAccount;
