const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Referencia al modelo de usuario (que deberías tener definido)
  },
  game: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Game", // Referencia al modelo de juego
  },
  money: { type: Number, default: 0 }, // Dinero disponible para el jugador
  position: { type: Number, default: 0 }, // Posición del jugador en la partida
  playing: { type: Boolean, default: false },
  dice: { type: Number, default: 0 },
});

const Player = mongoose.model("Player", playerSchema);

module.exports = Player;
