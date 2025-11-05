import cron from 'node-cron';
import { findDueUnnotifiedTodos, markTodosNotified, markTodosReminded } from '../models/todoModel.js';
import { sendPushNotification } from '../services/pushService.js';


export const runNotificationOnce = async () => {
  const todos = await findDueUnnotifiedTodos();
  if (!todos.length) return;

  const dueNotifiedIds = [];
  const remindedIds = [];
  for (const todo of todos) {
    const now = Date.now();
    const isDue = todo.dueAt && new Date(todo.dueAt).getTime() <= now && !todo.isNotified;
    const isRemind = todo.remindAt && new Date(todo.remindAt).getTime() <= now && todo.notificationCount === 0 && !todo.isNotified;

    if (isDue) {
      const payload = {
        title: 'Deadline!',
        body: `${todo.content} (Deadline: ${new Date(todo.dueAt).toLocaleString()})`,
        data: { todoId: todo.id }
      };
      await sendPushNotification(payload);
      dueNotifiedIds.push(todo.id);
      continue;
    }

    if (isRemind) {
      const payload = {
        title: 'Nhắc nhở',
        body: `${todo.content} (Nhắc lúc: ${new Date(todo.remindAt).toLocaleString()})`,
        data: { todoId: todo.id }
      };
      await sendPushNotification(payload);
      remindedIds.push(todo.id);
    }
  }
  if (dueNotifiedIds.length) await markTodosNotified(dueNotifiedIds);
  if (remindedIds.length) await markTodosReminded(remindedIds);
};

export const startNotificationJob = () => {
  // chạy mỗi phút
  cron.schedule('* * * * *', runNotificationOnce, { timezone: 'UTC' });
  // chạy ngay khi server khởi động
  runNotificationOnce().catch(() => {});
};