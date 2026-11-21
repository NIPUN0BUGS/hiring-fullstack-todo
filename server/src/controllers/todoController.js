import Todo from '../models/Todo.js';
import {
  todoIdSchema,
  updateDoneSchema,
  validateTodoInput,
} from '../utils/validateTodo.js';

function getValidatedId(id, res) {
  const result = todoIdSchema.safeParse(id);
  if (!result.success) {
    res.status(400).json({ success: false, message: 'The task ID is invalid.' });
    return null;
  }
  return result.data;
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
    return res.status(400).json({
      success: false,
      message: 'Please check the task details.',
      errors: validation.errors,
    });
  }

  try {
    const todo = await Todo.create(validation.data);
    return res.status(201).json({ success: true, data: todo });
  } catch (error) {
    return next(error);
  }
}

export async function updateTodo(req, res, next) {
  const id = getValidatedId(req.params.id, res);
  if (!id) return;

  const validation = validateTodoInput(req.body, { partial: true });
  if (!validation.valid) {
    return res.status(400).json({
      success: false,
      message: 'Please check the task details.',
      errors: validation.errors,
    });
  }

  try {
    const todo = await Todo.findByIdAndUpdate(id, { $set: validation.data }, {
      new: true,
      runValidators: true,
      context: 'query',
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
  const id = getValidatedId(req.params.id, res);
  if (!id) return;

  const validation = updateDoneSchema.safeParse(req.body ?? {});
  if (!validation.success) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid completion value.',
      errors: { done: validation.error.issues[0]?.message || 'Invalid completion value.' },
    });
  }

  try {
    const todo = await Todo.findById(id);
    if (!todo) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    todo.done = typeof validation.data.done === 'boolean' ? validation.data.done : !todo.done;
    await todo.save();
    return res.json({ success: true, data: todo });
  } catch (error) {
    return next(error);
  }
}

export async function deleteTodo(req, res, next) {
  const id = getValidatedId(req.params.id, res);
  if (!id) return;

  try {
    const todo = await Todo.findByIdAndDelete(id);
    if (!todo) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }
    return res.json({
      success: true,
      data: { _id: todo._id, message: 'Task deleted successfully.' },
    });
  } catch (error) {
    return next(error);
  }
}
