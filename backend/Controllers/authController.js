import User from "./models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// REGISTER USER
export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // التحقق من البيانات
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // التأكد من عدم وجود الإيميل من قبل
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // إنشاء المستخدم
    const user = await User.create({
      username,
      email,
      password,
    });

    // الرد على الواجهة
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// LOGIN USER
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // التأكد من وجود المستخدم
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // مقارنة الباسوورد (باستخدام الميثود داخل الموديل)
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // الرد مع Token
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
