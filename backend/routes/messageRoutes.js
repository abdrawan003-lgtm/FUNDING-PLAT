import express from "express";
import { sendMessage, getMessages } from "../Controllers/messageController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// إرسال رسالة
router.post("/", protect, sendMessage);

// جلب رسائل محادثة معينة
router.get("/:chatId", protect, getMessages);

export default router;
