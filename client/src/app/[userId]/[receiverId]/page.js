"use client";

import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";
import io from "socket.io-client";
const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
// Connect to backend socket server
const socket = io(NEXT_PUBLIC_API_URL);

const Receiver = () => {
	const { userId, receiverId } = useParams();
	const [message, setMessage] = useState("");
	const [fetchedMessage, setFetchedMessage] = useState([]);
	const [images, setImages] = useState([]); // New state for selected images

	const messagesEndRef = useRef(null);

	const handleChange = (e) => setMessage(e.target.value);

	// Handle image selection
	const handleImageChange = (e) => {
		const files = Array.from(e.target.files);
		if (files.length + images.length > 5) {
			alert("You can only send up to 5 images per message.");
			return;
		}
		setImages((prev) => [...prev, ...files]);
	};

	// Remove selected image
	const removeImage = (idx) => {
		setImages((prev) => prev.filter((_, i) => i !== idx));
	};

	const handleClick = async (e) => {
		e.preventDefault();
		if (!message && images.length === 0) {
			alert("Please enter a message or select images.");
			return;
		}

		// Send text + images using FormData
		const formData = new FormData();
		formData.append("sender", userId);
		formData.append("receiver", receiverId);
		formData.append("text", message);
		images.forEach((img) => formData.append("images", img));

		try {
			const response = await fetch(
				`${NEXT_PUBLIC_API_URL}/message/sendMessage`,
				{
					method: "POST",
					body: formData,
				},
			);
			const data = await response.json();
			console.log("Message sent:", data);
			await getMessage();
		} catch (error) {
			console.error(error);
		} finally {
			setMessage("");
			setImages([]); // Clear selected images
		}
	};

	const getMessage = useCallback(async () => {
		try {
			const response = await fetch(
				`${NEXT_PUBLIC_API_URL}/message/${userId}/${receiverId}/getMessage`,
			);
			const data = await response.json();
			setFetchedMessage(data.chat?.messages || []);
		} catch (error) {
			console.error(error);
		}
	}, [userId, receiverId]);

	// Fixed async useEffect
	useEffect(() => {
		const fetchMessages = async () => {
			await getMessage();
		};
		fetchMessages();
	}, [getMessage]);

	// Scroll to bottom
	useEffect(() => {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [fetchedMessage]);

	// Socket.io real-time messages
	useEffect(() => {
		if (userId) socket.emit("join", userId);

		socket.on("newMessage", (msg) => {
			setFetchedMessage((prev) => [...prev, msg]);
		});

		return () => {
			socket.off("newMessage");
		};
	}, [userId]);

	return (
		<main className="flex flex-col min-h-screen w-screen bg-gray-100 text-black p-4">
			{/* Header */}
			<div className="w-full flex justify-between items-center bg-white shadow px-4 py-2 rounded-md mb-4">
				<div className="font-semibold text-gray-800">
					Receiver: {receiverId}
				</div>
				<div className="text-gray-600">You: {userId}</div>
			</div>

			{/* Chat Messages Box */}
			<div className="h-96 min-w-full max-w-md mx-auto bg-white shadow-inner rounded-lg p-3 overflow-y-scroll">
				{fetchedMessage?.map((m, i) => {
					const isSender = m.sender === userId;
					return (
						<div
							key={i}
							className={`my-2 flex ${
								isSender ? "justify-end" : "justify-start"
							}`}
						>
							<div
								className={`max-w-[70%] p-4 break-all rounded-lg shadow ${
									isSender
										? "bg-blue-500 text-white"
										: "bg-gray-200 text-gray-800"
								}`}
							>
								<div className="text-sm">{m.text}</div>
								{m.images && m.images.length > 0 && (
									<div className="flex flex-wrap gap-2 mt-2">
										{m.images.map((img, idx) => (
											<img
												key={idx}
												alt={`chat-img-${idx}`}
												src={`http://localhost:8000/uploads/chat/${img}`}
												width={200}
												className="h-24 w-24 object-cover rounded"
											/>
										))}
									</div>
								)}
								<div className="text-[10px] text-gray-700 mt-1">
									{new Date(m.createdAt).toLocaleTimeString()}
								</div>
							</div>
						</div>
					);
				})}
				<div ref={messagesEndRef}></div>
			</div>

			{/* Input Box */}
			<div className="flex flex-col gap-2 mt-4 max-w-md mx-auto w-full">
				{/* Image previews */}
				{images.length > 0 && (
					<div className="flex gap-2 flex-wrap">
						{images.map((img, idx) => (
							<div key={idx} className="relative">
								<img
									src={URL.createObjectURL(img)}
									alt={`preview-${idx}`}
									className="h-20 w-20 object-cover rounded"
								/>
								<button
									onClick={() => removeImage(idx)}
									className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-1"
								>
									×
								</button>
							</div>
						))}
					</div>
				)}

				<div className="flex gap-2">
					<input
						type="text"
						value={message}
						onChange={handleChange}
						placeholder="Type a message..."
						className="flex-1 px-3 py-2 border border-gray-400 rounded-lg focus:outline-blue-500"
					/>
					<input
						type="file"
						accept="image/*"
						multiple
						onChange={handleImageChange}
						className="px-3 py-2 border border-gray-400 rounded-lg cursor-pointer"
					/>
					<button
						onClick={handleClick}
						className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
					>
						Send
					</button>
				</div>
			</div>
		</main>
	);
};

export default Receiver;
