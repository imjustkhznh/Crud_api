import 'dotenv/config';
import app from "./src/app.js";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";

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

// Tạo http server và tích hợp socket.io
const server = createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  // Sự kiện nhận tin nhắn từ client và phát lại cho tất cả client
  socket.on('chat message', (msg) => {
    console.log('Received message:', msg);
    io.emit('chat message', msg); // gửi lại cho tất cả client
  });
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
