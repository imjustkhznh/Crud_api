import 'dotenv/config';
import app from "./src/app.js";

const PORT = Number(process.env.PORT) || 3000;


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
