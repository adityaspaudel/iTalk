"use client";

import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

const Receiver = () => {
  const { userId, receiverId } = useParams();
  const [message, setMessage] = useState("");
  const [fetchedMessage, setFetchedMessage] = useState({});
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
      alert("message send", data);
      getMessage();
    } catch (error) {
      console.error;
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
      setFetchedMessage(data);
    } catch (error) {
      console.log(error);
    }
  }, [userId, receiverId]);
  useEffect(() => {
    getMessage();
  }, [getMessage]);
  return (
    <main className="flex flex-col min-h-screen w-screen bg-gray-100 text-black">
      <div className="flex flex-col justify-between items-center w-full">
        <div>Receiver</div>
        <div>Sender</div>
      </div>
      <div>
        {/* <pre>{JSON.stringify(fetchedMessage, 2, 2)}</pre> */}

        <div className="h-80 w-80 bg-amber-200 overflow-scroll">
          {fetchedMessage?.chat?.messages?.map((m, v) => (
            <div key={m._id}>
              <div>{m.text}</div>
              <div>{new Date(m.createdAt).toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>
      <input
        value={message}
        onChange={handleChange}
        className="border border-gray-500"
      />
      <button onClick={handleClick}>send</button>
    </main>
  );
};

export default Receiver;
