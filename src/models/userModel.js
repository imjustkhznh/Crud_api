import pool from "../config/db.js";

export const getAllUsers = async () => {
  const [rows] = await pool.query("SELECT * FROM users");
  return rows;
};

export const getUserById = async (id) => {
  const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
  return rows[0];
};

export const createUser = async (user) => {
  const { name, email } = user;
  const [result] = await pool.query("INSERT INTO users (name, email) VALUES (?, ?)", [name, email]);
  return { id: result.insertId, ...user };
};

export const updateUser = async (id, user) => {
  const { name, email } = user;
  await pool.query("UPDATE users SET name=?, email=? WHERE id=?", [name, email, id]);
  return { id, ...user };
};

export const deleteUser = async (id) => {
  await pool.query("DELETE FROM users WHERE id=?", [id]);
  return { message: "User deleted" };
};
