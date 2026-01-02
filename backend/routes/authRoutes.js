import express from "express";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendVerificationEmail } from "../utils/email.js";

const router = express.Router();

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// ================================
//  REGISTER + SEND VERIFICATION EMAIL
// ================================
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, accountType } = req.body;

    if (!username || !email || !password || !accountType) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const verificationToken = crypto.randomBytes(32).toString("hex");

    const user = new User({
      username,
      email,
      password, // 🔥 بدون hash
      accountType,
      isVerified: false,
      verificationToken:verificationToken,
    });

    await user.save();
console.log("EMAIL:", email);
    try {
      await sendVerificationEmail({
        to: email,
        token: verificationToken,
        username,
      });
    } catch (err) {
      console.error("Email send error:", err.message);
    }

    res.status(201).json({
      message:
        "User registered successfully. Please check your email to verify your account.",
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================================
//  VERIFY EMAIL ROUTE
// ================================
router.get("/verify", async (req, res) => {
  const { token } = req.query;

  const user = await User.findOne({ verificationToken: token });

  if (!user)
    return res.status(400).json({ message: "Token invalid or user not found" });

  user.isVerified = true;
  user.verificationToken = null;
  await user.save();

  return res.redirect("http://localhost:3000/verify-success");
});



// ================================
//  LOGIN (ONLY IF VERIFIED)
// ================================
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Email and password are required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    // Check verification
    if (!user.isVerified) {
      return res.status(401).json({
        message: "Please verify your email before logging in.",
      });
    }

    const token = generateToken(user._id);

    res.json({
      token,
      username: user.username,
      userId: user._id,
      accountType: user.accountType,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
