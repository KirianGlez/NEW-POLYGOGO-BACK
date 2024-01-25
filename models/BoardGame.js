const mongoose = require('mongoose');

const boardGameSchema = new mongoose.Schema({
  game_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Game", // Referencia al modelo de juego
  },
  title: { type: String, required: true },
  boxes: [
    {
      id: { type: String, required: true },
      player_owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Player",
        default: undefined,
      },
      title: { type: String, required: true },
      price: { type: String, required: true },
      rent_price: { type: Number, required: true, default: 0  },
      group: { type: String, required: true },
      upgrade_level: { type: Number, default: 1 },
    }
  ]
});

// Define el modelo basado en el esquema
const BoardGame = mongoose.model('board-game', boardGameSchema);

module.exports = BoardGame;