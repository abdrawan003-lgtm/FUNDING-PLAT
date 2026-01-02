// backend/routes/projectRoutes.js
import express from "express";
import multer from "multer";
import Project from "../models/project.js";
import protect from "../middleware/authMiddleware.js";
import Notification from "../models/notification.js";
import authMiddleware from "../middleware/authMiddleware.js";
import User from "../models/user.js";


const router = express.Router();

// Multer لتخزين الصورة في الذاكرة
const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * POST /api/projects
 * إنشاء مشروع جديد مع صورة
 */
router.post("/", protect, upload.single("image"), async (req, res) => {
  try {
    const { title, description, goal, location, category, deadline, notes } = req.body;

    if (!title || !description || !goal || !location) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const project = await Project.create({
      title,
      description,
      goal,
      location,
      category,
      deadline,
      notes,
      user: req.user._id,
      image: req.file ? { data: req.file.buffer, contentType: req.file.mimetype } : null
    });
    
// ===== إشعارات للمستخدمين المهتمين بنفس الفئة =====
if (category) {
  const interestedUsers = await User.find({
    "interests.name": category,
    _id: { $ne: req.user._id } // لا نرسل إشعار لمنشئ المشروع نفسه
  });

  await Promise.all(
    interestedUsers.map(u => {
      u.notifications.push({
        type: "interest",
        message: `A new project "${newProject.title}" was added in your interested category "${category}"`,
        project: newProject._id,
      });
      return u.save();
    })
  );
}
    res.status(201).json(project);
  } catch (err) {
    console.error("CREATE PROJECT ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET /api/projects
 * جلب جميع المشاريع
 */
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("user", "username email _id")
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET /api/projects/:id
 * جلب مشروع واحد
 */
router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("user", "username email _id");

    if (!project) return res.status(404).json({ message: "Project not found" });

    res.json(project);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
/**
 * PUT /api/projects/:id
 * تعديل مشروع مع إمكانية تحديث الصورة
 */
router.put("/:id", protect, upload.single("image"), async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) return res.status(404).json({ message: "Project not found" });

    // ✅ استخدم equals() بدل المقارنة المباشرة لتفادي مشاكل الـ ObjectId vs String
    if (!project.user.equals(req.user._id))
      return res.status(403).json({ message: "Not allowed" });

    const { title, description, goal, category, deadline, location, notes } = req.body;

    if (title !== undefined) project.title = title;
    if (description !== undefined) project.description = description;
    if (goal !== undefined) project.goal = Number(goal);
    if (category !== undefined) project.category = category;
    if (deadline !== undefined) project.deadline = deadline;
    if (location !== undefined) project.location = location;
    if (notes !== undefined) project.notes = notes;

    if (req.file) {
      project.image = { data: req.file.buffer, contentType: req.file.mimetype };
    }

    project.progress =
      project.goal > 0 ? Math.round((project.currentAmount / project.goal) * 100) : 0;

    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (err) {
    console.error("UPDATE PROJECT ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});


/**
 * PATCH /api/projects/:id/status
 */
router.patch("/:id/status", protect,authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatus = ["open", "in_discussion", "funded", "closed"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    if (project.user.toString() !== req.user._id) return res.status(403).json({ message: "Not allowed" });

    project.status = status;
    await project.save();

    res.json({ message: "Status updated", status });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * DELETE /api/projects/:id
 */
router.delete("/:id", protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) return res.status(404).json({ message: "Project not found" });

    // ✅ مقارنة صحيحة بين ObjectId و String
    if (!project.user.equals(req.user._id))
      return res.status(403).json({ message: "Not allowed" });

    await project.deleteOne();
    res.json({ message: "Project deleted", id: project._id });
  } catch (err) {
    console.error("DELETE PROJECT ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});
 
// POST /api/users/save-project/:projectId save project
router.post("/save-project/:projectId", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const projectId = req.params.projectId;

    if (!user.savedProjects.includes(projectId)) {
      user.savedProjects.push(projectId);
      await user.save();
    }

    res.json({ message: "Project saved successfully", savedProjects: user.savedProjects });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/users/save-project/:projectId unsave project
router.delete("/save-project/:projectId", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const projectId = req.params.projectId;

    user.savedProjects = user.savedProjects.filter(id => id.toString() !== projectId);
    await user.save();

    res.json({ message: "Project removed from saved projects", savedProjects: user.savedProjects });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/users/saved-projects get all saved project
router.get("/saved-projects", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("savedProjects");
    res.json(user.savedProjects);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


/** * ❤️ Like / Unlike project */
 router.post("/:id/like", authMiddleware, async (req, res) => { try { const userId = req.user.id; const projectId = req.params.id; // ===== جلب المشروع =====
 // 
  const project = await Project.findById(projectId); if (!project) { return res.status(404).json({ message: "Project not found" }); } // ===== جلب المستخدم ===== 
  const user = await User.findById(userId); if (!user) { return res.status(404).json({ message: "User not found" }); } const likedIndex = project.likes.findIndex( (id) => id.toString() === userId ); const category = project.category;
 //  // ===================== // UNLIKE // ===================== 
 // 
 if (likedIndex !== -1) { project.likes.splice(likedIndex, 1); if (category) { const interest = user.interests.find( (i) => i.name === category ); if (interest) { interest.weight -= 1; if (interest.weight <= 0) { user.interests = user.interests.filter( (i) => i.name !== category ); } } } } 
 // // ===================== // LIKE // =====================
 // 
  else { project.likes.push(userId); if (category) { const interest = user.interests.find( (i) => i.name === category ); if (interest) { interest.weight += 1; } else { user.interests.push({ name: category, weight: 1 }); } } } await project.save(); await user.save(); res.status(200).json({ likesCount: project.likes.length, liked: likedIndex === -1, interests: user.interests, }); } catch (error) { console.error("Like project error:", error); res.status(500).json({ message: "Server error" }); } });
export default router;
