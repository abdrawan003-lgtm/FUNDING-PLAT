// backend/middleware/upload.js
import multer from "multer";

// نخزن الصورة بالذاكرة كـ buffer
const storage = multer.memoryStorage();

const upload = multer({ storage });

export default upload;
