const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");

dotenv.config();

const app = express();
const server = http.createServer(app);

// ================= ALLOWED ORIGINS =================
const allowedOrigins = [
  "http://localhost:5173",
  "https://voting-app11.vercel.app"
];

// ================= SOCKET.IO =================
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
});

// ================= MIDDLEWARE =================
app.set("io", io);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true
  })
);

app.use(express.json());
app.use("/uploads", express.static("uploads"));

// ================= ROUTES =================
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const voteRoutes = require("./routes/voteRoutes");
const candidateRoutes = require("./routes/candidateRoutes");

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/vote", voteRoutes);
app.use("/api/candidates", candidateRoutes);

// ================= SOCKET CONNECTION =================
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// ================= DATABASE =================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// ================= SERVER =================
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});