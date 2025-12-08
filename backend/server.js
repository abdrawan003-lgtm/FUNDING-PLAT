import express from "express";
import { Server } from "socket.io";
import http from "http";
import jwt from "jsonwebtoken";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import profileRoutes from "./routes/profileRoutes.js";

// Routes
import projectRoutes from "./routes/projectRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

// Models
import Message from "./models/message.js";
import Chat from "./models/chat.js";
import Project from "./models/project.js";

dotenv.config();
const app = express();

// DB connection
connectDB();

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());

// Routes
app.use("/api/projects", projectRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/profile", profileRoutes);

// HTTP server
const server = http.createServer(app);

// Socket.IO
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

// Auth for socket
io.use((socket, next) => {
  try {
    const token = socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization?.split(" ")[1];

    if (!token) return next(new Error("Auth Failed: No Token"));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    next();

  } catch (err) {
    next(new Error("Auth Failed: Invalid Token"));
  }
});

// Socket.IO events
io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.userId);

  // Join project chat
  socket.on("joinProject", async (projectId) => {
    try {
      // إنشاء أو جلب شات المشروع
      let chat = await Chat.findOne({ _id: projectId });
      if (!chat) {
        chat = await Chat.create({
          _id: projectId,
          name: null,
          isGroup: true,
          members: [socket.userId],
          admins: [socket.userId]
        });
      }

      socket.join(`chat_${chat._id}`);
      console.log(`User ${socket.userId} joined room chat_${chat._id}`);
    } catch (err) {
      console.log("Join project error:", err);
    }
  });

  // إرسال رسالة
  socket.on("sendProjectMessage", async ({ projectId, content }) => {
    try {
      const message = await Message.create({
        chatId: projectId,
        sender: socket.userId,
        recipients: [], // لاحقاً تضيف أعضاء المشروع
        content,
      });

      await Chat.findByIdAndUpdate(projectId, { lastMessage: message._id });

      io.to(`chat_${projectId}`).emit("newProjectMessage", message);

    } catch (err) {
      console.log("Error sending msg:", err);
      socket.emit("error", "Message send failed");
    }
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.userId);
  });
});

// تشغيل السيرفر
const PORT = process.env.PORT || 5005;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
