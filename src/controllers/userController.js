import * as User from "../models/userModel.js";

export const getUsers = async (req, res) => {
  try {
    const users = await User.getAllUsers();
    res.json(users);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('getUsers error:', err);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.getUserById(req.params.id);

    // User not exist
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // User exists
    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: user,
    });

  } catch (err) {
    console.error("getUserById error:", err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};



export const createUser = async (req, res) => {
  try {
    const { email } = req.body;

    // Email exist
    const existing = await User.getUserByEmail(email);
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Create new user
    const newUser = await User.createUser(req.body);

    const userFromDB = await User.getUserById(newUser.id);

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: userFromDB,
    });
  } catch (err) {
    console.error("createUser error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};


export const updateUser = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { email, name, phone, address } = req.body;

    // Validate ID
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    // Check user exists
    const existingUser = await User.getUserById(id);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Validate email 
    if (req.body.email && req.body.email !== existingUser.email) {
    const duplicate = await User.getUserByEmail(req.body.email);
      if (duplicate) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
        });
      } 
    }


    // Update user
    const updatedUser = await User.updateUser(id, req.body);

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });

  } catch (err) {
    console.error("updateUser error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};


export const deleteUser = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    // Check user exists
    const existingUser = await User.getUserById(id);
    if (!existingUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Delete user
    await User.deleteUser(id);
    return res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    console.error("deleteUser error:", err);
    return res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
  }
};
