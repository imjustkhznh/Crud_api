import 'dotenv/config';
import app from "./app.js";

const PORT = Number(process.env.PORT) || 3000;


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
