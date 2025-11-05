import express from 'express';
import {
  createTodo, listTodos, getTodoById, updateTodoById, deleteTodoById
} from '../controllers/todoController.js';

const router = express.Router();
router.get('/', listTodos);
router.get('/:id', getTodoById);
router.post('/', createTodo);
router.put('/:id', updateTodoById);
router.delete('/:id', deleteTodoById);
export default router;