import Message from "../models/message.js";
import Chat from "../models/chat.js";

export const sendMessage = async (req, res) => {
  try {
    const { chatId, content, recipients } = req.body;

    const message = await Message.create({
      chatId,
      sender: req.user._id,
      recipients,
      content
    });

    // التحديث داخل السجل الأخير للمحادثة
    await Chat.findByIdAndUpdate(chatId, { lastMessage: message._id });

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chatId: req.params.chatId })
      .populate("sender", "username email");

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
