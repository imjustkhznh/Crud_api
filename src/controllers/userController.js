import * as User from "../models/userModel.js";

export const getUsers = async (req, res) => {
  try {
    const users = await User.getAllUsers();
    res.json(users);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('getUsers error:', err && err.stack ? err.stack : err);
    if (err && err.code === 'ER_ACCESS_DENIED_ERROR') {
      return res.status(500).json({
        error: 'Database access denied. Check DB_USER and DB_PASSWORD in your .env (or DB credentials).'
      });
    }
    res.status(500).json({ error: err && err.message ? err.message : 'Internal Server Error' });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.getUserById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('getUserById error:', err && err.stack ? err.stack : err);
    if (err && err.code === 'ER_ACCESS_DENIED_ERROR') {
      return res.status(500).json({
        error: 'Database access denied. Check DB_USER and DB_PASSWORD in your .env (or DB credentials).'
      });
    }
    res.status(500).json({ error: err && err.message ? err.message : 'Internal Server Error' });
  }
};

export const createUser = async (req, res) => {
  try {
    const newUser = await User.createUser(req.body);
    res.status(201).json(newUser);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('createUser error:', err && err.stack ? err.stack : err);
    if (err && err.code === 'ER_ACCESS_DENIED_ERROR') {
      return res.status(500).json({
        error: 'Database access denied. Check DB_USER and DB_PASSWORD in your .env (or DB credentials).'
      });
    }
    if (err && err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: err && err.message ? err.message : 'Internal Server Error' });
  }
};

export const updateUser = async (req, res) => {
  try {
    const updated = await User.updateUser(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('updateUser error:', err && err.stack ? err.stack : err);
    if (err && err.code === 'ER_ACCESS_DENIED_ERROR') {
      return res.status(500).json({
        error: 'Database access denied. Check DB_USER and DB_PASSWORD in your .env (or DB credentials).'
      });
    }
    if (err && err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: err && err.message ? err.message : 'Internal Server Error' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const deleted = await User.deleteUser(req.params.id);
    res.json(deleted);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('deleteUser error:', err && err.stack ? err.stack : err);
    if (err && err.code === 'ER_ACCESS_DENIED_ERROR') {
      return res.status(500).json({
        error: 'Database access denied. Check DB_USER and DB_PASSWORD in your .env (or DB credentials).'
      });
    }
    res.status(500).json({ error: err && err.message ? err.message : 'Internal Server Error' });
  }
};
