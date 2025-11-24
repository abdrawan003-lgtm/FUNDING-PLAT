import express from "express";
import User from "../models/user.js";
import jwt from "jsonwebtoken";

const router = express.Router();


// إنشاء Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};
//يRoutes محمية ما بيدخل عليها غير المستخدم يلي معه Token صحيح.
router.get("/profile", (req, res) => {
  res.json({ message: "Welcome to your profile!", userId: req.userId });
});

// تسجيل مستخدم جديد
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const user = new User({ username, email, password });
    await user.save();

    res.status(201).json({
      message: "User registered successfully",
      userId: user._id,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/all", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// تسجيل الدخول
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = generateToken(user._id);

    res.json({
      token,
      username: user.username,
      userId: user._id,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
