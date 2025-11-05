import pool from '../config/db.js';

export const upsertSubscription = async (sub) => {
  await pool.query(
    `INSERT INTO push_subscriptions (endpoint, p256dh, auth)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE
       p256dh=VALUES(p256dh),
       auth=VALUES(auth)`,
    [sub.endpoint, sub.keys.p256dh, sub.keys.auth]
  );
};

export const getAllSubscriptions = async () => {
  const [rows] = await pool.query(`SELECT * FROM push_subscriptions`);
  return rows;
};
