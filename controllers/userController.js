const bcrypt = require("bcrypt");
const generateTokenAndSetCookies = require("../utils/generateToken");
const User = require("../models/userSchema");

const getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    const users = await User.find();

    res.status(200).json({ data: users });
  } catch (error) {
    console.error("Error fetching users for admin:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

const signup = async (req, res) => {
  try {
    let { username, email, password, role } = req.body;
    const isUser = await User.findOne({ email });
    if (isUser) return res.status(400).json({ message: "User already exists" });
    let hashpassword = await bcrypt.hash(password, 10);
    let user = await User.create({
      username: username,
      email: email,
      password: hashpassword,
      role,
    });
    generateTokenAndSetCookies(user._id, res);
    res
      .status(201)
      .json({ success: true, message: "User created successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating user", error: error.message });
  }
};

const login = async (req, res) => {
  try {
    let { email, password } = req.body;
    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });
    let isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });
    generateTokenAndSetCookies(user._id, res);
    res.json({
      success: true,
      message: "Logged in successfully",
      data: user.username,
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

const logout = (req, res) => {
  res.clearCookie("token");
  res.json({ success: true, message: "Logged out successfully" });
};

module.exports = { signup, login, logout, getAllUsers };
