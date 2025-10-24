import 'dotenv/config';
import express from "express";
import userRoutes from "./routes/userRoutes.js";

const app = express();
app.use(express.json());

// simple request logger to help debug "Cannot GET /users"
app.use((req, res, next) => {
  // eslint-disable-next-line no-console
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// mount router on /users so http://localhost:3000/users works
app.use("/users", userRoutes);

// health / debug route (do not expose password)
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
app.use((err, req, res) => {
  // eslint-disable-next-line no-console
  console.error('Express error handler:', err && err.stack ? err.stack : err);
  res.status(err && err.status ? err.status : 500).json({
    error: err && err.message ? err.message : 'Internal Server Error'
  });
});

export default app;
