const mongoose = require('mongoose');

const skinSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, enum: ['dices', 'pieces'], required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
});

const Skin = mongoose.model('Skin', skinSchema);

module.exports = Skin;