const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({  
  task: String,
  done: Boolean
});

module.exports = mongoose.model('Todo', TodoSchema);