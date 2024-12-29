const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  text: String,
  completed: Boolean,
  createdAt: Date,
  dueDate: Date,
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'], // Match values used in `generateTodo`
    required: true,
  },
  category: {
    type: String,
    enum: ['Work', 'Personal', 'Urgent', 'Others'], // Define valid categories
    required: true,
  },
});

module.exports = mongoose.model('Todo', todoSchema);
