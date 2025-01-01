const express = require("express");
const app = express();
const dotenv = require("dotenv");
const { conection } = require("./config/db");
const userRouter = require("./routes/userRouter");
const todoRouter = require("./routes/todorouter");
const auth = require("./middleware/auth");
const cors = require("cors");

dotenv.config();
app.use(cors());
app.use(express.json())

app.use(express.urlencoded({ extended: true }));

app.use("/user",userRouter);
app.use(auth);
app.use("/todo",todoRouter);




app.listen(process.env.PORT,(error) => {
  if (error) {
    console.log("server is not running");
    return;
  }
  console.log("server is running on port",process.env.PORT);
  conection();
});