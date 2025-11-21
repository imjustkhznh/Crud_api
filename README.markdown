# Todo List with Web Push Notifications

Task management with push notifications for reminders and deadlines.

## Requirements

- Node.js >= 16
- MySQL >= 5.7

## Installation

1. Install dependencies: `npm install`

2. Create database:
```sql
CREATE DATABASE todo_db;
USE todo_db;

CREATE TABLE IF NOT EXISTS push_subscriptions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  endpoint TEXT NOT NULL,
  p256dh VARCHAR(255) NOT NULL,
  auth VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_endpoint (endpoint(255))
);

CREATE TABLE IF NOT EXISTS todos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL,
  content VARCHAR(255) NOT NULL,
  due_at DATETIME NOT NULL,
  remind_at DATETIME NULL,
  is_done TINYINT(1) DEFAULT 0,
  is_notified TINYINT(1) DEFAULT 0,
  notified_at DATETIME NULL,
  notification_count INT DEFAULT 0,
  is_remind_notified BOOLEAN DEFAULT 0,
  is_deleted TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  INDEX idx_due (is_done, is_notified, due_at),
  INDEX idx_remind (is_done, is_notified, remind_at),
  INDEX idx_is_deleted (is_deleted)
);
```

3. Generate VAPID keys: `npx web-push generate-vapid-keys`

4. Create `.env`:
```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password

```

5. Run: `npm run dev`

Access: `http://localhost:3000/todo.html`

## API

- GET `/todos` - List todos
- POST `/todos` - Create: `{ content, remindAt, dueAt }`
- PUT `/todos/:id` - Update: `{ content?, remindAt?, dueAt?, isDone? }`
- DELETE `/todos/:id` - Delete
- GET `/push/public-key` - Get VAPID key
- POST `/push/subscribe` - Subscribe

## Notes

- Notification job runs every 10 seconds
- Only incomplete tasks receive notifications
- Requires HTTPS in production
- Must access via `http://localhost:3000` for Service Worker
