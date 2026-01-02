import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import Message from "../models/message.js";
import Project from "../models/project.js";

const router = express.Router();

/* =======================
   GET messages for a project (1-to-1)
   /api/messages/project/:projectId/:otherUserId
   ======================= */
router.get(
  "/project/:projectId/:otherUserId",
  authMiddleware,
  async (req, res) => {
    try {
      const { projectId, otherUserId } = req.params;

      const messages = await Message.find({
        project: projectId,
        $or: [
          { sender: req.user._id, receiver: otherUserId },
          { sender: otherUserId, receiver: req.user._id },
        ],
      })
        .populate("sender", "username")
        .sort({ createdAt: 1 });

      res.json(messages);
    } catch (err) {
      res.status(500).json({ message: "Failed to load messages" });
    }
  }
);

/* =======================
   POST send a message
   /api/messages/project
   ======================= */
router.post(
  "/project",
  authMiddleware,
)

export default router;
