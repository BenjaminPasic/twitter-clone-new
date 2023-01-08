import { io } from "socket.io-client";
import { useEffect, useState } from "react";
const socket = io.connect("http://localhost:3001");

const Chat = () => {
  const [chatInput, setChatInput] = useState("");
  const [messageReceived, setMessageReceived] = useState("");
  const sendMessage = () => {
    socket.emit("send-message", chatInput);
  };

  useEffect(() => {
    socket.on("receive-message", (message) => {
      setMessageReceived(message);
    });
  }, [socket]);

  return (
    <div className="chat">
      <input onChange={(e) => setChatInput(e.target.value)} />
      <button onClick={sendMessage}>Send message</button>
    </div>
  );
};

export default Chat;
