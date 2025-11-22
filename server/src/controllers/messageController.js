const mongoose = require("mongoose");
const Message = require("../models/messageModel");

const sendMessage = async (req, res) => {
  try {
    const { sender, receiver, text } = req.body;

    if (!sender || !receiver || !text) {
      return res.status(400).send({ message: "All fields are required" });
    }

    let chat = await Message.findOne({
      participants: { $all: [sender, receiver] },
    });

    if (!chat) {
      chat = new Message({
        participants: [sender, receiver],
        messages: [],
      });
    }

    chat.messages.push({
      sender,
      text,
    });

    await chat.save();

    res.status(200).send({
      message: "Message sent successfully",
      chat,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const getMessage = async (req, res) => {
  try {
    const { sender, receiver } = req.params;

    if (!sender || !receiver) {
      return res.status(400).send({ message: "All fields are required" });
    }
    let chat = await Message.findOne({
      participants: { $all: [sender, receiver] },
    });
    if (!chat) {
      return res.status(200).json({ message: "no message found", chat });
    }
    res.status(200).json({ message: "messages fetched successfully", chat });
  } catch (error) {
    console.error(error);
  }
};

module.exports = { sendMessage, getMessage };
