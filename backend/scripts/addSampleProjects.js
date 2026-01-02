import mongoose from "mongoose";
import dotenv from "dotenv";
import Project from "../models/project.js";
import User from "../models/user.js";
import sampleProjects from "../sampleProjects.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const seedProjects = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    // جلب المستخدمين الموجودين
    const users = await User.find();
    if (!users.length) {
      console.log("No users found! Add users first.");
      process.exit();
    }

    // توزيع المشاريع على المستخدمين بالتساوي
    const projectsToInsert = sampleProjects.map((proj, index) => {
      const user = users[index % users.length];
      return {
        ...proj,
        user: user._id,
        owner: user._id,
      };
    });

    await Project.insertMany(projectsToInsert);
    console.log("Projects added successfully!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedProjects();
