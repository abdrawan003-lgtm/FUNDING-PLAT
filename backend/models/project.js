import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  goal: { type: Number, required: true },
  lastInterestedUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  image: {
    data: Buffer,      // البيانات الثنائية للصورة
    contentType: String
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }
  ],
  notes: { type: String, default: "" }, // ← حقل الملاحظات
  createdAt: { type: Date, default: Date.now },
  category: { type: String },
  deadline: { type: Date },
  location: { type: String, required: true },
  status: {
    type: String,
    enum: ["open", "in_discussion", "funded", "closed"],
    default: "open"
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" } // ← صاحب المشروع
}, { timestamps: true });

// Indexes
projectSchema.index({ user: 1 });
projectSchema.index({ category: 1 });
projectSchema.index({ createdAt: -1 });

const Project = mongoose.model("Project", projectSchema);
export default Project;
