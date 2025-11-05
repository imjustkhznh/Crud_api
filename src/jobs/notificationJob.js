import cron from 'node-cron';
import { findDueUnnotifiedTodos, markTodosNotified } from '../models/todoModel.js';
import { sendPushNotification } from '../services/pushService.js';

export const runNotificationOnce = async () => {
  const todos = await findDueUnnotifiedTodos();
  if (!todos.length) return;

  const notifiedIds = [];
  for (const todo of todos) {
    const payload = {
      title: 'Deadline!',
      body: `${todo.content} (Deadline: ${new Date(todo.dueAt).toLocaleString()})`,
      data: { todoId: todo.id }
    };
    await sendPushNotification(payload);
    notifiedIds.push(todo.id);
  }
  await markTodosNotified(notifiedIds);
};

export const startNotificationJob = () => {

  cron.schedule('* * * * *', runNotificationOnce, { timezone: 'UTC' });

  runNotificationOnce().catch(() => {});
};