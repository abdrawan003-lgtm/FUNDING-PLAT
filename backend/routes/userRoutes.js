import express from "express";
import User from "../models/user.js";
import Notification from "../models/notification.js"; 
import { verifyToken } from "../middleware/authMiddleware.js"; // افترض عندك middleware للتحقق من التوكن

const router = express.Router();



/**
 * حفظ مشروع عند المستخدم
 * POST /api/users/save-project/:projectId
 */
router.post("/save-project/:projectId", verifyToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const { projectId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // إذا المشروع غير موجود مسبقًا في savedProjects
    if (!user.savedProjects.includes(projectId)) {
      user.savedProjects.push(projectId);
      await user.save();
    }
const notification = new Notification({
        user: userId,
        type: "saved",
        project: projectId,
        message: `You saved the project "${projectId}"`,
      });
      await notification.save();
    res.status(200).json({ message: "Project saved", savedProjects: user.savedProjects });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * إزالة مشروع من المحفوظات
 * DELETE /api/users/save-project/:projectId
 */
router.delete("/save-project/:projectId", verifyToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const { projectId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.savedProjects = user.savedProjects.filter((id) => id.toString() !== projectId);
    await user.save();

    res.status(200).json({ message: "Project removed", savedProjects: user.savedProjects });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
