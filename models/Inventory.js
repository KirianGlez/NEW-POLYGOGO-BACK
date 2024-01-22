const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    skins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skin'}],
});

const Inventory = mongoose.model('Inventory', inventorySchema);

module.exports = Inventory;