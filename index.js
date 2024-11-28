const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const dbConnect = require("./config/db");
const userRouter = require("./routes/userRoutes");
const courseRouter = require("./routes/courseRoutes");
require("dotenv").config;
const app = express();

const PORT = process.env.PORT;

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

app.use("/user", userRouter);
app.use("/courses", courseRouter);

app.get("/", (req, res) => {
  res.send("welcome to Education Management System");
});

dbConnect();
// app.listen(PORT, () => {
//   console.log("listening on port");
// });

module.exports = app;
