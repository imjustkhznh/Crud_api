import 'dotenv/config';
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import userRoutes from "./routes/userRoutes.js";
import pushRoutes from "./routes/pushRoutes.js";
import todoRoutes from "./routes/todoRoutes.js";


// Lấy đường dẫn tuyệt đối
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use("/push", pushRoutes);

// Middleware log request
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

app.use(express.static(__dirname));

// Serve cụ thể từng file (phòng khi browser cache cũ)
app.get("/test-push.html", (req, res) => {
  res.sendFile(path.join(__dirname, "test-push.html"));
});

app.get("/sw.js", (req, res) => {
  res.sendFile(path.join(__dirname, "sw.js"));
});

// API routes
app.use("/users", userRoutes);
app.use("/push", pushRoutes);
app.use("/todos", todoRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Server is running 🚀",
    endpoints: ["/users", "/push", "/todos"],
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
  console.error('Express error handler:', err?.stack || err);
  res.status(err?.status || 500).json({
    error: err?.message || 'Internal Server Error'
  });
});

export default app;
