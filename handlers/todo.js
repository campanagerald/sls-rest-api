
const commonMiddlewares = require('../middlewares/commonMiddlewares');
const { connectToDatabase } = require('../db');

const Todo = require('../models/todo');

const createTodo = async (event) => {
  try {
    await connectToDatabase();

    const todo = await Todo.create(JSON.parse(event.body));
    
    return {
      statusCode: 200,
      body: JSON.stringify(todo)
    };
  } catch (error) {
    return {
      statusCode: error.statusCode || 500,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Could not create the todo.'
    };
  }
};

module.exports.createTodo = commonMiddlewares(createTodo);

const getOneTodo = async (event) => {
  try {
    await connectToDatabase();
    
    const todo = await Todo.findById(event.pathParameters.id);
    
    return {
      statusCode: 200,
      body: JSON.stringify(todo)
    };
  } catch (error) {
    return {
      statusCode: error.statusCode || 500,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Could not fetch the todo.'
    };
  }
};

module.exports.getOneTodo = commonMiddlewares(getOneTodo);

const getAllTodos = async (event) => {
  try {
    await connectToDatabase();
    
    const todos = await Todo.find();

    return {
      statusCode: 200,
      body: JSON.stringify(todos)
    };
  } catch (error) {
    return {
      statusCode: error.statusCode || 500,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Could not fetch the todos.'
    }
  }
};

module.exports.getAllTodos = commonMiddlewares(getAllTodos);

const updateTodo = async (event) => {
  try {
    await connectToDatabase();

    const todo = await Todo.findByIdAndUpdate(event.pathParameters.id, JSON.parse(event.body), { new: true });
    
    return {
      statusCode: 200,
      body: JSON.stringify(todo)
    };
  } catch (error) {
    return {
      statusCode: error.statusCode || 500,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Could not fetch the todos.'
    }
  }
};

module.exports.updateTodo = commonMiddlewares(updateTodo);


const deleteTodo = async (event) => {
  try {
    await connectToDatabase();
    
    const todo = await Todo.findByIdAndRemove(event.pathParameters.id);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Removed todo with id: ' + todo._id, todo: todo })
    };
  } catch (error) {
    return {
      statusCode: error.statusCode || 500,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Could not fetch the todos.'
    };
  }
};

module.exports.deleteTodo = commonMiddlewares(deleteTodo);