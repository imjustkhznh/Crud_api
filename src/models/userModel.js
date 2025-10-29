import pool from "../config/db.js";

export const getAllUsers = async () => {
  const [rows] = await pool.query("SELECT * FROM users");
  return rows;
};

export const getUserById = async (id) => {
  const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
  return rows[0];
};

export const getUserByEmail = async (email) => {
  const [rows] = await pool.query(
    "SELECT * FROM users WHERE email = ? LIMIT 1",
    [email]
  );
  return rows.length ? rows[0] : null;
};


export const createUser = async (user) => {
  const { name, email, phone, address } = user;
  const [result] = await pool.query("INSERT INTO users (name, email, phone, address) VALUES (?, ?, ?, ?)", [name, email, phone, address]);
  return { id: result.insertId, user, phone, address };
};

export const updateUser = async (id, user) => {
  const { name, email, phone, address } = user;
  await pool.query("UPDATE users SET name=?, email=?, phone=?, address=? WHERE id=?", [name, email, phone, address, id]);
  const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
  return rows[0];
};

export const deleteUser = async (id) => {
  await pool.query("DELETE FROM users WHERE id=?", [id]);
  return { message: "User deleted" };
};
