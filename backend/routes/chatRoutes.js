import express from "express";
import { createChat, getUserChats } from "../Controllers/chatController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// إنشاء محادثة جديدة (بين شخصين أو مجموعة)
router.post("/", protect, createChat);

// جلب جميع محادثات المستخدم
router.get("/", protect, getUserChats);

export default router;
