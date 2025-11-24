import express from "express";
import Project from "../models/project.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * POST /api/projects
 * إنشاء مشروع جديد
 */
router.post("/", protect, async (req, res) => {
  try {
    const { title, description, goal, image, category, deadline, location } = req.body;
    if (!title || !description || !goal || !image || !category || !deadline || !location) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const project = new Project({
      title,
      description,
      goal,
      currentAmount: 0,
      progress: 0,
      image,
      category,
      deadline,
      location,
      user: req.userId // ربط المشروع بالمستخدم الحالي من Token
    });

    const created = await project.save();
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/**
 * GET /api/projects/user/:userId
 * جلب مشاريع مستخدم معين
 */
router.get("/user/:userId", async (req, res) => {
  try {
    const projects = await Project.find({ user: req.params.userId }).sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/**
 * GET /api/projects/:id
 * جلب مشروع واحد بالتفاصيل
 */
router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate("user", "name email");
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/**
 * GET /api/projects
 * جلب كل المشاريع
 */
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find().populate("user", "name email").sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/**
 * PUT /api/projects/:id
 * تعديل مشروع
 */
router.put("/:id", protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const { title, description, goal, currentAmount, image, category, deadline, location } = req.body;

    if (title !== undefined) project.title = title;
    if (description !== undefined) project.description = description;
    if (goal !== undefined) project.goal = goal;
    if (currentAmount !== undefined) project.currentAmount = currentAmount;
    if (image !== undefined) project.image = image;
    if (category !== undefined) project.category = category;
    if (deadline !== undefined) project.deadline = deadline;
    if (location !== undefined) project.location = location;

    // إعادة حساب التقدم تلقائيًا
    project.progress = project.goal > 0 ? (project.currentAmount / project.goal) * 100 : 0;

    const updated = await project.save();
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/**
 * DELETE /api/projects/:id
 * حذف مشروع
 */
router.delete("/:id", protect, async (req, res) => {
  try {
    const deleted = await Project.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Project not found" });
    res.json({ message: "Project deleted", id: deleted._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
