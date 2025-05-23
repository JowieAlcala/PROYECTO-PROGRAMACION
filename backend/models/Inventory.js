const mongoose = require('mongoose');

const InventoryItemSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  quantity: { type: Number, default: 0 },
  price:    { type: Number, required: true }
});

module.exports = mongoose.model('InventoryItem', InventoryItemSchema);
