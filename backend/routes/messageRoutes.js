import express from "express";
import Message from "../models/message.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// إرسال رسالة جديدة
router.post("/", protect, async (req, res) => {
  const { receiver, text } = req.body;
  if (!receiver || !text) return res.status(400).json({ message: "Receiver and text are required" });

  try {
    const message = new Message({
      sender: req.userId,
      receiver,
      text
    });
    const savedMessage = await message.save();
    res.status(201).json(savedMessage);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// **هنا تحطي Route جلب الرسائل بين المستخدمين**
router.get("/:userId", protect, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.userId, receiver: req.params.userId },
        { sender: req.params.userId, receiver: req.userId }
      ]
    }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
