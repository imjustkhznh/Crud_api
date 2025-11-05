import pool from '../config/db.js';

export const upsertSubscription = async ({ endpoint, keys }) => {
  const { p256dh, auth } = keys;
  await pool.query(
    `INSERT INTO push_subscriptions (endpoint, p256dh, auth)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE p256dh=VALUES(p256dh), auth=VALUES(auth)`,
    [endpoint, p256dh, auth]
  );
  return { endpoint };
};

export const getAllSubscriptions = async () => {
  const [rows] = await pool.query('SELECT endpoint, p256dh, auth FROM push_subscriptions');
  return rows.map(r => ({ endpoint: r.endpoint, keys: { p256dh: r.p256dh, auth: r.auth } }));
};