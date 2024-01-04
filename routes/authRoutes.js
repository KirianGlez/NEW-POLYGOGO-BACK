const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
// Ruta de registro de usuarios
router.post("/register", authController.register);

// Ruta de inicio de sesión
router.post("/login", authController.login);

// Ruta de verificación de token
router.post("/verify-token", authController.verify);


module.exports = router;
