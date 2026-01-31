const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
	{
		participants: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		messages: [
			{
				sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
				text: { type: String },
				images: [
					{
						imageUrl: { type: String, required: true },
					},
				],

				createdAt: { type: Date, default: Date.now },
			},
		],
	},
	{ timestamps: true },
);

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
