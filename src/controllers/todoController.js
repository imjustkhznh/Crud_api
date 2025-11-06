import * as Todo from '../models/todoModel.js';

export const createTodo = async (req, res) => {
  try {
    const { userId, content, dueAt, remindAt } = req.body;
    if (!content || !dueAt) return res.status(400).json({ error: 'content,dueAt required' });
    const todo = await Todo.createTodo({ userId, content, dueAt, remindAt });
    res.status(201).json(todo);
  } catch (e) {
    res.status(500).json({ error: e && e.message ? e.message : 'Failed to create todo' });
  }
};

export const listTodos = async (req, res) => {
  try {
    res.json(await Todo.findTodos());
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
};

export const getTodoById = async (req, res) => {
  try {
    const todo = await Todo.findTodoById(req.params.id);
    if (!todo) return res.status(404).json({ error: 'Not found' });
    res.json(todo);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch todo' });
  }
};

export const updateTodoById = async (req, res) => {
  try {
    const existing = await Todo.findTodoById(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Not found' });

    const now = Date.now();
    const isExpired = existing.dueAt && new Date(existing.dueAt).getTime() <= now;

    if (isExpired && typeof req.body.content === 'string' && req.body.content !== existing.content) {
      return res.status(400).json({ error: 'Cannot edit content after due time' });
    }

    const todo = await Todo.updateTodo(req.params.id, req.body);
    res.json(todo);
  } catch (e) {
    res.status(500).json({ error: 'Failed to update todo' });
  }
};

export const deleteTodoById = async (req, res) => {
  try {
    const existing = await Todo.findTodoById(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Not found' });

    const now = Date.now();
    const isExpired = existing.dueAt && new Date(existing.dueAt).getTime() <= now;
    if (!isExpired) return res.status(400).json({ error: 'Can only delete after due time' });

    await Todo.softDeleteTodo(req.params.id);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'Failed to delete todo' });
  }
};