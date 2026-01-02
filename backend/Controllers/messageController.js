import Message from "../models/message.js";
import Project from "../models/project.js";

export const sendProjectMessage = async (req, res) => {
  try {
    const { projectId, content } = req.body;

    if (!content?.trim()) {
      return res.status(400).json({ message: "Message is empty" });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // 🔥 هون التصحيح المهم
    const senderId = req.user._id.toString();

    const receiver =
      senderId === project.user.toString()
        ? project.lastInterestedUser
        : project.user;

    if (!receiver) {
      return res.status(400).json({ message: "No chat partner found" });
    }

    const message = await Message.create({
      project: projectId,
      sender: senderId,
      receiver,
      content,
    });

    const populatedMessage = await message.populate(
      "sender",
      "username"
    );

    res.status(201).json(populatedMessage);
  } catch (err) {
    console.error("SEND MESSAGE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};
