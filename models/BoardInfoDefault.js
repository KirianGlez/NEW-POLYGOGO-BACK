const mongoose = require('mongoose');

const boardInfoDefaultSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, required: true },
  title: { type: String, required: true },
  boxes: [
    {
      id: { type: String, required: true },
      title: { type: String, required: true },
      price: { type: String, required: true },
      group: { type: String, required: true },
    }
  ]
});

// Define el modelo basado en el esquema
const BoardInfoDefault = mongoose.model('boards-info-default', boardInfoDefaultSchema);

module.exports = BoardInfoDefault;