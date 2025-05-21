const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true
  },
  descripcio: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Item', ItemSchema);