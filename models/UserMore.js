const mongoose = require('mongoose');

const userMoreSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    polymoney: { type: Number, default: 0},
  });

const UserMore = mongoose.model('UserMore', userMoreSchema);

module.exports = UserMore;