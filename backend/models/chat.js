import mongoose from "mongoose";
const chatSchema = new mongoose.Schema({
  name: String, // اسم المجموعة أو null للمحادثة الفردية
  isGroup: { type: Boolean, default: false },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  admins: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
}, { timestamps: true });
export default mongoose.model("Chat", chatSchema);