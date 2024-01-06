const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema(
  {
    isActive: { type: Boolean, default: false }, // Estado de la partida: activa o inactiva
    createdAt: { type: Date, default: Date.now }, // Fecha de creación de la partida
    finishedAt: { type: Date }, // Fecha de finalización de la partida (puede ser null si no ha terminado)

    players: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Player", // Referencia al modelo de jugador (que se definirá más adelante)
      },
    ],

    isInGame: { type: Boolean, default: false }, // Indica si la partida está en juego
  },
  {
    // Definición de validaciones
    validate: {
      validator: function (players) {
        return players.length <= 4; // Limitar a un máximo de 4 jugadores
      },
      message: "La partida no puede tener más de 4 jugadores.",
    },
  }
);

const Game = mongoose.model("Game", gameSchema);

module.exports = Game;