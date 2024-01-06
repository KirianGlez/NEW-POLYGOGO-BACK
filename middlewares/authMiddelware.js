const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token)
    return res
      .status(401)
      .json({ message: "Acceso denegado. No se proporcionó un token." });

  try {
    const decoded = jwt.verify(token, "secreto_supersecreto"); // Reemplaza 'tu_secreto' con tu clave secreta
    req.user = decoded; // Guarda el usuario decodificado en el objeto de solicitud para su uso posterior
    next();
  } catch (error) {
    res.status(400).json({ message: "Token inválido." });
  }
};
