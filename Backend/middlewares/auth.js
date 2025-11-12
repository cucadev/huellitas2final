const jwt = require('jsonwebtoken');

exports.auth = (rolesPermitidos = []) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.split(' ')[1]; // Espera formato: Bearer <token>

    if (!token) {
      return res.status(401).json({ mensaje: 'Token faltante' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secreto_clave');

      // Si hay roles definidos y el del usuario no está incluido, rechazo
      if (rolesPermitidos.length && !rolesPermitidos.includes(decoded.rol)) {
        return res.status(403).json({ mensaje: 'Sin permisos suficientes' });
      }

      // Guardo la info del usuario en req para usarla después
      req.usuario = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ mensaje: 'Token inválido' });
    }
  };
};