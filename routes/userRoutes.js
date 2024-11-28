const { Router } = require("express");
const {
  signup,
  login,
  logout,
  getAllUsers,
} = require("../controllers/userController");
const { auth } = require("../middlewares/auth");

const userRouter = Router();

userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.post("/logout", logout);
userRouter.get("/allusers", auth, getAllUsers);

module.exports = userRouter;
