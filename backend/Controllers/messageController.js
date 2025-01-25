import Conversation from "../Models/conversationModel.js";
import Message from "../Models/messageModel.js";

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;

    const { id: receiverId } = req.params;

    const senderId = req.user._id;

    // Check if a conversation already exists between the sender and receiver
    let chat = await Conversation.findOne({
      participant: { $all: [senderId, receiverId] },
    });

    // If no conversation exists, create a new one
    if (!chat) {
      chat = await Conversation.create({
        participant: [senderId, receiverId],
        messages: [],
      });
    }

    // Create a new message document
    const newMessage = new Message({
      senderId,
      receiverId,
      message,
      conversationId: chat._id,
    });

    // If the message is created successfully, add its ID to the conversation
    if (newMessage) {
      chat.messages.push(newMessage._id);
    }

    // Save the updated conversation and the new message to the database
    await Promise.all([chat.save(), newMessage.save()]);

    // Send a success response with the new message
    res.status(201).json(newMessage);
  } catch (error) {
    // Log the error and send an error response
    console.error("Error in sendMessage:", error.message);
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

export const getMessage = async (req, res) => {
  try {
    const { id: receiverId } = req.params;
    const senderId = req.user._id;
    // Find the conversation between the sender and receiver
    const chat = await Conversation.findOne({
      participant: { $all: [senderId, receiverId] },
    }).populate({
      path: "messages",
      options: { sort: { createdAt: 1 } }, // Sort messages by createdAt in ascending order
    });
    if (!chat) {
      console.log("No conversation found.");
      return res.status(200).json([]);
    }
    // Return the messages
    res.status(200).json(chat.messages);
  } catch (error) {
    console.error("Error in getMessage:", error.message);
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};
