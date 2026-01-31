const mongoose = require("mongoose");
const Message = require("../models/messageModel");
const cloudinary = require("../middlewares/cloudinary");

let ioInstance;

const setMessageSocket = (io) => {
	ioInstance = io;
};

/* =========================
   SEND MESSAGE
========================= */
const sendMessage = async (req, res) => {
	try {
		const { sender, receiver, text } = req.body;

		if (!sender || !receiver) {
			return res.status(400).json({ message: "Sender and receiver required" });
		}

		if (!text && (!req.files || req.files.length === 0)) {
			return res.status(400).json({ message: "Message cannot be empty" });
		}

		const senderId = new mongoose.Types.ObjectId(sender);
		const receiverId = new mongoose.Types.ObjectId(receiver);

		/* 🔹 Upload images to Cloudinary */
		let uploadedImages = [];

		if (req.files && req.files.length > 0) {
			for (const file of req.files) {
				const result = await cloudinary.uploader.upload(file.path, {
					folder: "chat_images",
				});

				uploadedImages.push({
					imageUrl: result.secure_url,
				});
			}
		}

		/* 🔹 Find or create chat */
		let chat = await Message.findOne({
			participants: { $all: [senderId, receiverId] },
		});

		if (!chat) {
			chat = new Message({
				participants: [senderId, receiverId],
				messages: [],
			});
		}

		const newMessage = {
			sender: senderId,
			text: text || "",
			images: uploadedImages,
			createdAt: new Date(),
		};

		chat.messages.push(newMessage);
		await chat.save();

		/* 🔹 Emit socket event */
		if (ioInstance) {
			ioInstance.to(sender).emit("newMessage", newMessage);
			ioInstance.to(receiver).emit("newMessage", newMessage);
		}

		res.status(200).json({
			message: "Message sent successfully",
			data: newMessage,
		});
	} catch (error) {
		console.error("SEND MESSAGE ERROR:", error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

/* =========================
   GET MESSAGES
========================= */
const getMessage = async (req, res) => {
	try {
		const { sender, receiver } = req.params;

		if (!sender || !receiver) {
			return res.status(400).json({ message: "Sender and receiver required" });
		}

		const senderId = new mongoose.Types.ObjectId(sender);
		const receiverId = new mongoose.Types.ObjectId(receiver);

		const chat = await Message.findOne({
			participants: { $all: [senderId, receiverId] },
		})
			.populate("messages.sender", "username avatar")
			.sort({ updatedAt: -1 });

		if (!chat) {
			return res.status(200).json({
				message: "No messages found",
				data: [],
			});
		}

		res.status(200).json({
			message: "Messages fetched successfully",
			data: chat.messages,
		});
	} catch (error) {
		console.error("GET MESSAGE ERROR:", error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

module.exports = {
	sendMessage,
	getMessage,
	setMessageSocket,
};
