import 'dotenv/config';
import app from "./src/app.js";

const PORT = Number(process.env.PORT) || 3000;

// Ensure DB credentials present (helps catch "using password: NO")
if (process.env.DB_USER && !process.env.DB_PASSWORD) {
  // eslint-disable-next-line no-console
  console.warn(
    'Database configuration warning: DB_USER is set but DB_PASSWORD is missing.\n' +
      'Create a .env file (or set env vars) with DB_USER and DB_PASSWORD, for example:\n' +
      'DB_HOST=localhost\nDB_PORT=3306\nDB_USER=root\nDB_PASSWORD=your_password\nDB_NAME=your_db\n' +
      'Server will continue running so you can access the health endpoint; DB requests will fail until credentials are fixed.'
  );
  // continue instead of exiting so server can run for debugging
}

if (process.env.DB_PORT && Number(process.env.DB_PORT) === PORT) {
  // eslint-disable-next-line no-console
  console.error(
    `Configuration error: server PORT (${PORT}) is the same as DB_PORT (${process.env.DB_PORT}).\n` +
      `Change PORT in your .env (e.g. PORT=3000) so it doesn't conflict with MySQL which uses 3306.`
  );
  process.exit(1);
}

// global handlers to make crashes more visible
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

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
