const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const swaggerUi = require('swagger-ui-express');
const specs = require('./swaggerOptions');

const app = express();
const server = require("http").createServer(app);

// Conexión a la base de datos
mongoose
  .connect(process.env.MONGO_DB_URL_DEV, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Conexión exitosa a MongoDB");
  })
  .catch((err) => {
    console.error("Error al conectar a MongoDB:", err.message);
  });

// Middleware para parsear JSON
app.use(express.json());

app.use(cors());

// Rutas de autenticación
const authRoutes = require("./routes/authRoutes");
const gameRoutes = require("./routes/gameRoutes");
const skinsRoutes = require("./routes/skinsRoutes");
app.use("/auth", authRoutes);
app.use("/game", gameRoutes);
app.use("/skin", skinsRoutes);

// Iniciar el servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

//Configuración de Express para swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));