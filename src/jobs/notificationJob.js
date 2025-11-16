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

    // Reminder
    if (isRemind) {
      // eslint-disable-next-line no-console
      console.log(`[JOB] Reminder -> todoId=${todo.id} content="${todo.content}" remindAt=${todo.remindAt}`);
      const payload = {
        title: '💡 Reminder!',
        body: `Your task "${todo.content}" is due soon.`,
        data: { todoId: todo.id }
      };
      await sendPushNotification(payload);
      remindedIds.push(todo.id);
      continue;
    }

    // Deadline
    if (isDue) {
      // eslint-disable-next-line no-console
      console.log(`[JOB] Deadline -> todoId=${todo.id} content="${todo.content}" dueAt=${todo.dueAt}`);
      const payload = {
        title: '🔥 Deadline!',
        body: `Your task "${todo.content}" is due NOW!`,
        data: { todoId: todo.id }
      };
      await sendPushNotification(payload);
      dueNotifiedIds.push(todo.id);
    }
  }

  if (dueNotifiedIds.length) await markTodosNotified(dueNotifiedIds);
  if (remindedIds.length) await markTodosReminded(remindedIds);
};

// chạy mỗi 10 giây để test
export const startNotificationJob = () => {
  // eslint-disable-next-line no-console
  console.log('🔔 Notification Job (new) started...');
  cron.schedule('*/10 * * * * *', runNotificationOnce, { timezone: 'Asia/Ho_Chi_Minh' });

  // chạy 1 lần khi server khởi động
  runNotificationOnce().catch(() => {});
};
