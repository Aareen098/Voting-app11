const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const cors = require("cors");
require("dotenv").config();

const voteRoutes = require("./routes/voteRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/vote", voteRoutes);

app.use("/api/user", userRoutes);

app.use("/api/auth", authRoutes);

app.get("/", (req,res) => {
  res.send("Server is working properly")
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
