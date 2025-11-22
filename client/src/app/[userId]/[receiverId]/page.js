"use client";

import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";
import io from "socket.io-client";
// Connect to backend socket server
const socket = io("http://localhost:8000");

const Receiver = () => {
  const { userId, receiverId } = useParams();
  const [message, setMessage] = useState("");
  const [fetchedMessage, setFetchedMessage] = useState([]);

  const messagesEndRef = useRef(null);

  const handleChange = (e) => {
    e.preventDefault();
    setMessage(e.target.value);
  };

  const handleClick = async (e) => {
    e.preventDefault();
    // alert("message sent" + message);
    console.log("message", message);
    try {
      const response = await fetch(
        "http://localhost:8000/message/sendMessage",
        {
          method: "Post",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sender: userId,
            receiver: receiverId,
            text: message,
          }),
        }
      );
      const data = await response.json();
      alert("message sent", JSON.stringify(data));
      getMessage();
    } catch (error) {
      console.error;
    } finally {
      setMessage("");
    }
  };

  const getMessage = useCallback(async () => {
    try {
      const sender = userId;
      const receiver = receiverId;
      const response = await fetch(
        `http://localhost:8000/message/${sender}/${receiver}/getMessage`
      );
      const data = await response.json();
      setFetchedMessage(data.chat?.messages || []);
    } catch (error) {
      console.log(error);
    } finally {
    }
  }, [userId, receiverId]);

  useEffect(() => {
    getMessage();
  }, [getMessage]);

  // messageEndReference
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [fetchedMessage]);

  useEffect(() => {
    if (userId) {
      socket.emit("join", userId);
    }

    // Listen for new incoming messages
    socket.on("newMessage", (msg) => {
      console.log("📩 Real-time message received:", msg);
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
      <div className="h-96 w-full max-w-md mx-auto bg-white shadow-inner rounded-lg p-3 overflow-y-scroll">
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
                className={`max-w-[70%] p-2 rounded-lg shadow 
                ${
                  isSender
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }
              `}
              >
                <div className="text-sm">{m.text}</div>
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
      <div className="flex gap-2 mt-4 max-w-md mx-auto w-full">
        <input
          value={message}
          onChange={handleChange}
          className="flex-1 px-3 py-2 border border-gray-400 rounded-lg focus:outline-blue-500"
          placeholder="Type a message..."
        />
        <button
          onClick={handleClick}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </main>
  );
};

export default Receiver;
