const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({  
  task: String,
  owner: mongoose.Types.ObjectId,
  done: Boolean
});

module.exports = mongoose.model('Todo', TodoSchema);