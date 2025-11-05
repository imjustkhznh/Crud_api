import pool from '../config/db.js';

const mapRow = r => ({
  id: r.id,
  userId: r.user_id,
  content: r.content,
  dueAt: r.due_at,
  remindAt: r.remind_at,
  isDone: Boolean(r.is_done),
  isNotified: Boolean(r.is_notified),
  notifiedAt: r.notified_at,
  notificationCount: r.notification_count,
  isDeleted: Boolean(r.is_deleted),
  createdAt: r.created_at,
  updatedAt: r.updated_at
});

function toMySQLDatetime(date) {
  if (!date) return null;
  // Chuyển ISO format → MySQL format (YYYY-MM-DD HH:MM:SS)
  return new Date(date).toISOString().slice(0, 19).replace('T', ' ');
}

export async function getAllTodos() {
  const [rows] = await pool.query("SELECT * FROM todos WHERE is_deleted = 0");
  return rows;
}

export const createTodo = async ({ userId = null, content, dueAt, remindAt = null }) => {
  const [res] = await pool.query(
    `INSERT INTO todos (user_id, content, due_at, remind_at) VALUES (?, ?, ?, ?)`,
    [userId, content, dueAt, remindAt]
  );
  const [rows] = await pool.query(`SELECT * FROM todos WHERE id=?`, [res.insertId]);
  return mapRow(rows[0]);
};

export const findTodos = async () => {
  const [rows] = await pool.query(
    `SELECT * FROM todos WHERE is_deleted=0 ORDER BY due_at DESC`
  );
  return rows.map(mapRow);
};

export const findTodoById = async (id) => {
  const [rows] = await pool.query(
    `SELECT * FROM todos WHERE id=? AND is_deleted=0`,
    [id]
  );
  return rows[0] ? mapRow(rows[0]) : null;
};

export const updateTodo = async (id, { content, dueAt, remindAt, isDone }) => {
  await pool.query(
    `UPDATE todos
       SET content = COALESCE(?, content),
           due_at = COALESCE(?, due_at),
           remind_at = COALESCE(?, remind_at),
           is_done = COALESCE(?, is_done)
     WHERE id=? AND is_deleted=0`,
    [content ?? null, dueAt ?? null, remindAt ?? null,
     typeof isDone === 'boolean' ? Number(isDone) : null, id]
  );
  return await findTodoById(id);
};

export const softDeleteTodo = async (id) => {
  await pool.query(`UPDATE todos SET is_deleted=1 WHERE id=?`, [id]);
  return { success: true };
};

export const findDueUnnotifiedTodos = async () => {
  const [rows] = await pool.query(
    `SELECT * FROM todos
     WHERE is_deleted=0 AND is_done=0 AND is_notified=0
       AND (due_at <= NOW() OR (remind_at IS NOT NULL AND remind_at <= NOW()))`
  );
  return rows.map(mapRow);
};

export const markTodosNotified = async (ids) => {
  if (!ids?.length) return;
  await pool.query(
    `UPDATE todos
       SET is_notified=1, notified_at=NOW(), notification_count=notification_count+1
     WHERE id IN (${ids.map(() => '?').join(',')})`,
    ids
  );
};