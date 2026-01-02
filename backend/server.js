import express from "express";
import http from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

// Routes
import projectRoutes from "./routes/projectRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import notificationsRoutes from "./routes/notificationRoutes.js";
// Models
import Message from "./models/message.js";
import Project from "./models/project.js";

dotenv.config();

const app = express();
connectDB();

/* ================= MIDDLEWARE ================= */
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

/* ================= ROUTES ================= */
app.use("/api/projects", projectRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/users", userRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/notifications",notificationsRoutes);

/* ================= SERVER ================= */
const server = http.createServer(app);

/* ================= SOCKET ================= */
const io = new Server(server, {
  cors: { origin: "*" },
});

/* ========== SOCKET AUTH ========== */
io.use((socket, next) => {
  try {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization?.split(" ")[1];

    if (!token) return next(new Error("No token"));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    next();
  } catch (err) {
    next(new Error("Invalid token"));
  }
});

/* ========== SOCKET EVENTS ========== */
io.on("connection", (socket) => {
  console.log("🟢 Connected:", socket.userId);

  /* ===== JOIN PROJECT CHAT ===== */
  socket.on("joinProjectChat", ({ projectId, otherUserId }) => {
    if (!projectId || !otherUserId) return;

    const roomId = `${projectId}_${[socket.userId, otherUserId]
      .sort()
      .join("_")}`;

    socket.join(roomId);
    console.log(`👥 User ${socket.userId} joined room ${roomId}`);
  });

  /* ===== SEND PROJECT MESSAGE ===== */
  socket.on("sendProjectMessage", async ({ projectId, content }) => {
    try {
      if (!content?.trim()) return;

      const project = await Project.findById(projectId);
      if (!project) return;

      const receiver =
        socket.userId.toString() === project.user.toString()
          ? project.lastInterestedUser
          : project.user;

      if (!receiver) return console.log("No receiver set for project");
      const roomId = `${projectId}_${[socket.userId, receiver]
        .sort()
        .join("_")}`;

        console.log("projectId:", projectId, "socket.userId:", socket.userId, "receiver:", receiver);
      const message = await Message.create({
        project: projectId,
        sender: socket.userId,
        receiver,
        content,
      });

      const populatedMessage = await Message.findById(message._id)
        .populate("sender", "username")
        .populate("receiver", "username");

      io.to(roomId).emit("newProjectMessage", populatedMessage);
    } catch (err) {
      console.log("❌ Send message error:", err.message);
    }
  });

  socket.on("disconnect", () => {
    console.log("🔴 Disconnected:", socket.userId);
  });
});

/* ================= RUN ================= */
const PORT = process.env.PORT || 5005;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
