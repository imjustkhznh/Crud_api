import 'dotenv/config';
import app from "./app.js";

const PORT = Number(process.env.PORT) || 3000;

// Ensure DB credentials present (nodemon entry)
if (process.env.DB_USER && !process.env.DB_PASSWORD) {
  // eslint-disable-next-line no-console
  console.warn(
    'Database configuration warning: DB_USER is set but DB_PASSWORD is missing.\n' +
      'Create a .env file (or set env vars) with DB_USER and DB_PASSWORD, for example:\n' +
      'DB_HOST=localhost\nDB_PORT=3306\nDB_USER=root\nDB_PASSWORD=your_password\nDB_NAME=your_db\n' +
      'Server will continue running so you can access the health endpoint; DB requests will fail until credentials are fixed.'
  );
  // continue instead of exiting so nodemon doesn't crash immediately
}

// Protect against accidentally using the DB port for the HTTP server
if (process.env.DB_PORT && Number(process.env.DB_PORT) === PORT) {
  // eslint-disable-next-line no-console
  console.error(
    `Configuration error: server PORT (${PORT}) is the same as DB_PORT (${process.env.DB_PORT}).`
  );
  process.exit(1);
}

process.on('uncaughtException', (err) => {
  // eslint-disable-next-line no-console
  console.error('Uncaught Exception', err);
  process.exit(1);
});
process.on('unhandledRejection', (reason) => {
  // eslint-disable-next-line no-console
  console.error('Unhandled Rejection', reason);
  process.exit(1);
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`🚀 Server running on port ${PORT}`);
});
