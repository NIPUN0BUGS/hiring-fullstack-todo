import mongoose from 'mongoose';
import Todo from '../models/Todo.js';
import { validateTodoInput } from '../utils/validateTodo.js';

function invalidId(id) {
  return !mongoose.isValidObjectId(id);
}

export async function getTodos(_req, res, next) {
  try {
    const todos = await Todo.find().sort({ createdAt: -1, _id: -1 }).lean();
    res.json({ success: true, data: todos });
  } catch (error) {
    next(error);
  }
}

export async function createTodo(req, res, next) {
  const validation = validateTodoInput(req.body);
  if (!validation.valid) {
    return res.status(400).json({ success: false, message: 'Please check the task details.', errors: validation.errors });
  }

  try {
    const todo = await Todo.create({
      title: req.body.title.trim(),
      description: typeof req.body.description === 'string' ? req.body.description.trim() : '',
    });
    return res.status(201).json({ success: true, data: todo });
  } catch (error) {
    return next(error);
  }
}

export async function updateTodo(req, res, next) {
  if (invalidId(req.params.id)) {
    return res.status(400).json({ success: false, message: 'The task ID is invalid.' });
  }

  const validation = validateTodoInput(req.body, { partial: true });
  if (!validation.valid) {
    return res.status(400).json({ success: false, message: 'Please check the task details.', errors: validation.errors });
  }

  try {
    const updates = {};
    if (Object.hasOwn(req.body, 'title')) updates.title = req.body.title.trim();
    if (Object.hasOwn(req.body, 'description')) updates.description = req.body.description.trim();

    const todo = await Todo.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!todo) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }
    return res.json({ success: true, data: todo });
  } catch (error) {
    return next(error);
  }
}

export async function toggleTodoDone(req, res, next) {
  if (invalidId(req.params.id)) {
    return res.status(400).json({ success: false, message: 'The task ID is invalid.' });
  }

  if (req.body?.done !== undefined && typeof req.body.done !== 'boolean') {
    return res.status(400).json({ success: false, message: 'The done value must be true or false.' });
  }

  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    todo.done = typeof req.body?.done === 'boolean' ? req.body.done : !todo.done;
    await todo.save();
    return res.json({ success: true, data: todo });
  } catch (error) {
    return next(error);
  }
}

export async function deleteTodo(req, res, next) {
  if (invalidId(req.params.id)) {
    return res.status(400).json({ success: false, message: 'The task ID is invalid.' });
  }

  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }
    return res.json({ success: true, data: { _id: todo._id, message: 'Task deleted successfully.' } });
  } catch (error) {
    return next(error);
  }
}
