import express from "express";
import Notification from "../models/notification.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/saved-projects", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("savedProjects"); 
  
    res.status(200).json({ savedProjects: user.savedProjects });
  } catch (err) {
    console.error("Fetch saved projects error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/notifications
router.get("/", authMiddleware, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .populate("project", "title") // نجيب عنوان المشروع
      .sort({ createdAt: -1 }); // الأحدث أولاً
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
