const { connectToDatabase } = require('../db');

const Todo = require('../models/todo');


module.exports.create = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  
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

module.exports.getOne = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

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

module.exports.getAll = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

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

module.exports.update = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

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

module.exports.delete = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    await connectToDatabase();
    
    const todo = await Todo.findByIdAndRemove(event.pathParameters.id);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Removed todo with id: ' + todo._id, todo: todo })
    };
  } catch (error) {
    return {
      statusCode: err.statusCode || 500,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Could not fetch the todos.'
    };
  }
};

