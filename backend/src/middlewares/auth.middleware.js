export const requireAuth = (req, res, next) => {
  if (!req.session?.userId) {
    return res.status(401).json({
      message: "Debés iniciar sesión para acceder.",
    });
  }

  next();
};

export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.session?.userId) {
      return res.status(401).json({
        message: "Debés iniciar sesión.",
      });
    }

    if (!roles.includes(req.session.role)) {
      return res.status(403).json({
        message: "No tenés permisos para realizar esta acción.",
      });
    }

    next();
  };
};
