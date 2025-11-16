import 'dotenv/config';
import app from "./app.js";

const PORT = Number(process.env.PORT) || 3000;

if (process.env.DB_PORT && Number(process.env.DB_PORT) === PORT) {
  console.error(`Configuration error: server PORT (${PORT}) is the same as DB_PORT (${process.env.DB_PORT}).`);
  process.exit(1);
}

process.on('uncaughtException', (err) => { console.error('Uncaught Exception', err); process.exit(1); });
process.on('unhandledRejection', (reason) => { console.error('Unhandled Rejection', reason); process.exit(1); });

app.listen(PORT, () => { console.log(`Server running on port ${PORT}`); });

import { startNotificationJob } from "./jobs/notificationJob.js";
startNotificationJob();