import express from "express";
import protect from "../middleware/protect.js";
import User from "../models/user.js";

const router = express.Router();

// ===== GET /api/profile =====
// البروفايل الخاص بالمستخدم المتصل
router.get("/", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // إضافة نوع الدعم إذا هو داعم
    const response = {
      ...user.toObject(),
      supportType: user.isSupporter ? user.type : undefined,
    };

    res.json(response);
  } catch (error) {
    console.error("Profile Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ===== GET /api/profile/:id =====
// البروفايل لأي مستخدم آخر (للزوار)
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // إضافة نوع الدعم إذا هو داعم
    const response = {
      ...user.toObject(),
      supportType: user.isSupporter ? user.type : undefined,
    };

    res.json(response);
  } catch (error) {
    console.error("Profile Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
