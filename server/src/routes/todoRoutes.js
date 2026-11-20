import { Router } from 'express';
import {
  createTodo,
  deleteTodo,
  getTodos,
  toggleTodoDone,
  updateTodo,
} from '../controllers/todoController.js';

const router = Router();

router.route('/')
  .get(getTodos)
  .post(createTodo);

router.route('/:id/done').patch(toggleTodoDone);
router.route('/:id')
  .put(updateTodo)
  .delete(deleteTodo);

export default router;
