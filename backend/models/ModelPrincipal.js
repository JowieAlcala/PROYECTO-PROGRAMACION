const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  xp: { type: Number, default: 0 }
});

module.exports = mongoose.model('Task', TaskSchema);
