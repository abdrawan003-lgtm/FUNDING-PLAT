import mongoose from "mongoose";
const messageSchema = new mongoose.Schema({
  chatId: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" }, // optional
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  recipients: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }], // users in the conversation
  content: { type: String, default: "" },
  attachments: [{ url: String, mime: String }], // صور/ملفات
  readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // read receipts
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });
export default mongoose.model("Message", messageSchema);