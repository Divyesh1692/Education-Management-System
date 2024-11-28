const mongoose = require("mongoose");
const { type } = require("os");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "teacher", "student"], required: true },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
