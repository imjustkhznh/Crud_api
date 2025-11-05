import 'dotenv/config';
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import userRoutes from "./routes/userRoutes.js";
import pushRoutes from "./routes/pushRoutes.js";
import todoRoutes from "./routes/todoRoutes.js";

const app = express();
app.use(express.json());

// Serve static assets (e.g., sw.js, test-push.html) from project src directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(__dirname));

app.use((req, res, next) => {
  // eslint-disable-next-line no-console
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});


app.use("/users", userRoutes);
app.use("/push", pushRoutes);
app.use("/todos", todoRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Server is running",
    endpoints: ["/users"],
    debug: {
      PORT: process.env.PORT || null,
      DB_HOST: process.env.DB_HOST || null,
      DB_USER: process.env.DB_USER || null,
      DB_PASSWORD_PROVIDED: !!process.env.DB_PASSWORD
    }
  });
});

// centralized error handler
app.use((err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error('Express error handler:', err && err.stack ? err.stack : err);
  res.status(err && err.status ? err.status : 500).json({
    error: err && err.message ? err.message : 'Internal Server Error'
  });
});

export default app;
