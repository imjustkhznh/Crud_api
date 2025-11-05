import 'dotenv/config';
import app from "./app.js";
import { startTodoReminderJob } from "./cron/todoReminder.js"; // ✅ Thêm dòng này

const PORT = Number(process.env.PORT) || 3000;

// Protect against accidentally using the DB port for the HTTP server
if (process.env.DB_PORT && Number(process.env.DB_PORT) === PORT) {
  console.error(
    `Configuration error: server PORT (${PORT}) is the same as DB_PORT (${process.env.DB_PORT}).`
  );
  process.exit(1);
}

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception', err);
  process.exit(1);
});
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection', reason);
  process.exit(1);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  startTodoReminderJob(); // ✅ Thêm dòng này — khởi động cron nhắc việc
});
