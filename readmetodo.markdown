# Todo Notifications - Quick Guide

A minimal todo API with web push (reminder + deadline).

## Requirements
- Node.js 16+
- MySQL

## Install
```bash
npm install
```

## Database
```sql
CREATE TABLE IF NOT EXISTS push_subscriptions (
  endpoint TEXT PRIMARY KEY,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL
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
  is_deleted TINYINT(1) DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## .env
```env
PORT=3000
DB_HOST=localhost
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=your_db
# Generate with: npx web-push generate-vapid-keys
VAPID_SUBJECT=mailto:you@example.com
VAPID_PUBLIC_KEY=...
VAPID_PRIVATE_KEY=...
```

## Run
```bash
npm run dev
```

## Subscribe & Test
1) Open `http://localhost:3000/test-push.html` → click "Subscribe to notifications".
2) Open `http://localhost:3000/todo.html` to add tasks.
3) Job (dev) runs every 10s and sends:
   - Reminder at `remindAt` (increments `notification_count`)
   - Deadline at `dueAt` (sets `is_notified=1` and increments count)

Example create (PowerShell):
```powershell
$rem=(Get-Date).AddMinutes(1).ToString("yyyy-MM-dd HH:mm:ss")
$due=(Get-Date).AddMinutes(2).ToString("yyyy-MM-dd HH:mm:ss")
$body=@{content="Drink water";remindAt=$rem;dueAt=$due}|ConvertTo-Json
Invoke-RestMethod -Method Post -Uri http://localhost:3000/todos -ContentType "application/json" -Body $body
```

## API
- GET `/todos`
- POST `/todos` { content, remindAt, dueAt }
- PUT `/todos/:id` { content?, remindAt?, dueAt?, isDone? }
- DELETE `/todos/:id`

## Notes
- Use `http://localhost:3000` so the Service Worker is same-origin.
- In production, serve over HTTPS for push to work.

