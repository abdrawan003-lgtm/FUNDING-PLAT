import express from "express";
import protect from "../middleware/protect.js"; // مسار الميدلوير يلي عندك
import User from "../models/user.js";

const router = express.Router();

// GET Profile
router.get("/", protect, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password"); // جلب المستخدم بدون باسورد

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Profile Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
