const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    const token = jwt.sign({ userId: user._id }, "secreto_supersecreto", {
      expiresIn: "16h",
    });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  }
};

exports.register = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Verifica si el usuario ya existe en la base de datos
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    // Crea un nuevo usuario en la base de datos
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "Usuario registrado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  }
};

exports.verify = async (req, res) => {
  const token = req.body.token; // Obtener el token del cuerpo de la solicitud
  if (!token) {
    return res.status(401).json({ message: "No se proporcionó un token" });
  }

  jwt.verify(token, "secreto_supersecreto", (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Token inválido" });
    }

    // El token es válido, puedes acceder a la información decodificada en 'decoded'
    return res.status(200).json({ message: "Token válido", decoded });
  });
};