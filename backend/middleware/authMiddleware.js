import jwt from "jsonwebtoken";
import User from "../models/user.js";


const protect = async(req, res, next) => {
  const authHeader = req.headers.authorization;

  // لازم يكون Bearer <token>
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.id; // منخزن ID المستخدم بالطلب

    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

export default protect;
