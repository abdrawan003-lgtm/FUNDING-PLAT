import mongoose from "mongoose";


const projectSchema = mongoose.Schema({
title:{ type:String,
        required: true,},   
description:{type: String, required:true,},
goal:{type: Number,
      required:true ,},
       currentAmount: {
    type: Number,
    default: 0,
  },
  image: {
    type: String, // ممكن يكون رابط للصورة
    required: true,
  },
   createdAt: {
    type: Date,
    default: Date.now,
  },
  category: {
    type: String,
    required: true,
  },
  deadline: {
    type: Date,
    required: true,
  },
  progress: {
    type: Number,
    default: 0, // نسبة مئوية 0-100
  },
  location: {
    type: String,
    required: true,
  },

user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true} }, // <-- هذا الحقل مهم
 {timestamps:true});


const Project = mongoose.model("Project", projectSchema);
export default Project;