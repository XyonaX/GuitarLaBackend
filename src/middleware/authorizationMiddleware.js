const authorizeAdmin = (req, res, next) => {
    const user = req.user; // El usuario debería haberse establecido en un middleware previo
  
    if (!user) {
      return res.status(401).json({ error: "Acceso denegado: Usuario no autenticado." });
    }
  
    if (user.role !== 'admin') {
      return res.status(403).json({ error: "Acceso denegado: No tienes permisos de administrador." });
    }
  
    next(); // Usuario autorizado, continúa con la siguiente función
  };
  
  export { authorizeAdmin };
  