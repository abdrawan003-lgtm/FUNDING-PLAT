import Chat from "../models/chat.js";

export const createChat = async (req, res) => {
  try {
    const { members, name, isGroup } = req.body;

    const chat = await Chat.create({
      members,
      name: isGroup ? name : null,
      isGroup: isGroup || false
    });

    res.status(201).json(chat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUserChats = async (req, res) => {
  try {
    const chats = await Chat.find({ members: req.user._id })
      .populate("members", "username email")
      .populate("lastMessage");

    res.json(chats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
