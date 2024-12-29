const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

// Import the Todo model
const Todo = require('./models/todo');

// Middleware
app.use(express.urlencoded({ extended: true })); // Parse form data

app.use(express.static('public')); // Serve static files

// MongoDB Connection
async function main() {
  try {
    await mongoose.connect('mongodb://localhost:27017/todo', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connection successful');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
}
main();

// Set EJS as the template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.get('/', async (req, res) => {
  try {
    const todos = await Todo.find(); // Fetch todos from the database
    res.render('home', { todos });
  } catch (err) {
    console.error('Error fetching todos:', err);
    res.status(500).send('Error loading todos');
  }
});

// Todo toggle route using PATCH
app.patch('/toggle/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Find the current todo
    const todo = await Todo.findById(id);
    if (!todo) {
      return res.status(404).redirect('back');
    }

    // Toggle the completed status
    todo.completed = !todo.completed;
    await todo.save();

    // Redirect back to the todos page
    res.redirect('/');
  } catch (error) {
    console.error('Toggle error:', error);
    res.redirect('/');
  }
});

app.post('/add', async (req, res) => {
  try {
    const todo = new Todo({
      text: req.body.todo, // Match this key with the form's `name` attribute
      completed: false,
      createdAt: new Date(),
      dueDate: faker.date.future(),
      priority: faker.helpers.arrayElement(['Low', 'Medium', 'High']), // Updated faker method
      category: faker.helpers.arrayElement(['Work', 'Personal', 'Urgent', 'Others']), // Updated faker method
    });
    await todo.save();
    res.redirect('/');
  } catch (error) {
    console.error('Add error:', error);
    res.redirect('/');
  }
});

app.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Attempt to find and delete the todo
    const todo = await Todo.findByIdAndDelete(id);

    if (!todo) {
      // If no todo is found, redirect to the home page with a 404 status
      return res.status(404).redirect('/');
    }

    // Successful deletion, redirect to the home page
    res.redirect('/');
  } catch (error) {
    console.error('Delete error:', error);
    res.redirect('/');
  }
});
app.get('/edit/:id', async (req, res) => {
  try {
      const todo = await Todo.findById(req.params.id);
      if (!todo) {
          return res.redirect('/');
      }
      res.render('editform.ejs', { todo });
  } catch (error) {
      console.error('Edit page error:', error);
     }
  });
app.patch('/edit/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    
    await Todo.findByIdAndUpdate(id, { text });
    res.redirect('/');
} catch (error) {
    console.error('Update error:', error);
    res.redirect('/todos');
}
});

  
    



// Start the server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
