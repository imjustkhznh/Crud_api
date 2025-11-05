
import pool from "../config/db.js";
import webpush from "web-push";

export async function startTodoReminderJob() {
  console.log("🔁 Todo Reminder Job started...");

  // chạy mỗi phút
  setInterval(async () => {
    const now = new Date();
    const [todos] = await pool.query(
      `SELECT * FROM todos 
       WHERE remind_at <= ? 
       AND is_notified = 0 
       AND is_deleted = 0`,
      [now]
    );

    if (todos.length === 0) return;

    console.log(`📬 Found ${todos.length} todos to notify`);

    // lấy danh sách người đăng ký push
    const [subs] = await pool.query(`SELECT * FROM push_subscriptions`);

    for (const todo of todos) {
      const payload = JSON.stringify({
        title: "⏰ Nhắc nhở công việc",
        body: `${todo.content} (hết hạn lúc ${todo.due_at})`,
      });

      for (const sub of subs) {
        try {
          await webpush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: { p256dh: sub.p256dh, auth: sub.auth },
            },
            payload
          );
        } catch (err) {
          console.error("❌ Push send error:", err.statusCode || err);
        }
      }

      // đánh dấu đã gửi
      await pool.query(
        `UPDATE todos 
         SET is_notified = 1, notified_at = ?, notification_count = notification_count + 1 
         WHERE id = ?`,
        [now, todo.id]
      );

      console.log(`✅ Notified todo ID ${todo.id}`);
    }
  }, 60 * 1000); // mỗi phút
}
