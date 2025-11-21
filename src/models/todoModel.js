import pool from '../config/db.js';

const mapRow = r => ({
  id: r.id,
  userId: r.user_id,
  content: r.content,
  dueAt: r.due_at,
  remindAt: r.remind_at,
  tag: r.tag,
  isDone: Boolean(r.is_done),
  isNotified: Boolean(r.is_notified),
  notifiedAt: r.notified_at,
  notificationCount: r.notification_count,
  isDeleted: Boolean(r.is_deleted),
  createdAt: r.created_at,
  updatedAt: r.updated_at
});

export const createTodo = async ({ userId = null, content, dueAt, remindAt = null, tag = 'work' }) => {
  const [res] = await pool.query(
    `INSERT INTO todos (user_id, content, due_at, remind_at, tag) VALUES (?, ?, ?, ?, ?)`,
    [userId, content, dueAt, remindAt, tag]
  );
  // debug: log insert result
  // eslint-disable-next-line no-console
  console.log('[todoModel.createTodo] insert result:', res && typeof res === 'object' ? { insertId: res.insertId, affectedRows: res.affectedRows } : res);
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

export const updateTodo = async (id, { content, dueAt, remindAt, isDone, tag }) => {
  await pool.query(
    `UPDATE todos
       SET content = COALESCE(?, content),
           due_at = COALESCE(?, due_at),
           remind_at = COALESCE(?, remind_at),
           is_done = COALESCE(?, is_done),
           tag = COALESCE(?, tag),
           is_notified = 0,
           notified_at = NULL,
           notification_count = 0 
     WHERE id=? AND is_deleted=0`,
    [content ?? null, dueAt ?? null, remindAt ?? null,
     typeof isDone === 'boolean' ? Number(isDone) : null, tag ?? null, id]
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
     WHERE is_deleted=0 AND is_done=0 AND (
       (due_at <= NOW() AND is_notified=0)
       OR (remind_at IS NOT NULL AND remind_at <= NOW() AND notification_count=0)
     )`
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

export const markTodosReminded = async (ids) => {
  if (!ids?.length) return;
  await pool.query(
    `UPDATE todos
       SET notification_count = notification_count + 1
     WHERE id IN (${ids.map(() => '?').join(',')})`,
    ids
  );
};