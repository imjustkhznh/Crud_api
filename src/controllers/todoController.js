import * as Todo from '../models/todoModel.js';

export const createTodo = async (req, res) => {
  const { userId, content, dueAt, remindAt } = req.body;
  if (!content || !dueAt) return res.status(400).json({ error: 'content,dueAt required' });
  const todo = await Todo.createTodo({ userId, content, dueAt, remindAt });
  res.status(201).json(todo);
};

export const listTodos = async (req, res) => res.json(await Todo.findTodos());

export const getTodoById = async (req, res) => {
  const todo = await Todo.findTodoById(req.params.id);
  if (!todo) return res.status(404).json({ error: 'Not found' });
  res.json(todo);
};

export const updateTodoById = async (req, res) => {
  const todo = await Todo.updateTodo(req.params.id, req.body);
  res.json(todo);
};

export const deleteTodoById = async (req, res) => {
  await Todo.softDeleteTodo(req.params.id);
  res.json({ success: true });
};