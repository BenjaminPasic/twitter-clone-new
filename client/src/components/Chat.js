import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { findEveryoneUserFollows } from "../api/followApi";
import { getConvoInfo } from "../api/conversationApi";
import "../css/Chat.css";
const socket = io.connect("http://localhost:3001");

const Chat = () => {
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentRoomId, setCurrentRoomId] = useState(undefined);
  const { data: users } = useQuery("follows", findEveryoneUserFollows, {
    cacheTime: 0,
  });
  const { data: conversationData, refetch } = useQuery(
    ["conversation", currentUser],
    getConvoInfo,
    {
      cacheTime: 0,
      enabled: false,
      onSuccess: (res) => {
        setCurrentUser(undefined);
        if (Array.isArray(res.data)) {
          setCurrentRoomId(res.data[0].room_id);
        } else {
          setCurrentRoomId(res.data);
        }
      },
    }
  );

  useEffect(() => {
    socket.emit("join-room", currentRoomId);
  }, [currentRoomId]);

  useEffect(() => {
    socket.on("receive-message", (message) => {
      setMessages((prevState) => [
        ...prevState,
        { message: message, received: true },
      ]);
    });
  }, [socket]);

  const sendMessage = () => {
    setMessages((prevState) => [
      ...prevState,
      { message: chatInput, received: false },
    ]);
    socket.emit("send-message", chatInput, currentRoomId);
  };

  const handleUsernameClick = (followee) => {
    setCurrentUser(followee);
    refetch();
  };

  const handleInput = (e) => {
    setChatInput(e.target.value);
  };

  return (
    <div className="chat">
      <div className="container">
        <div className="users">
          {users &&
            users.data.map((user, i) => {
              return (
                <p key={i} onClick={() => handleUsernameClick(user)}>
                  {user.username}
                </p>
              );
            })}
        </div>
        <div className="chat-interface">
          {messages.map((message) => {
            if (message.received === true) {
              return <p className="received">{message.message}</p>;
            } else {
              return <p className="sent">{message.message}</p>;
            }
          })}
          <input onChange={(e) => handleInput(e)} />
          <button onClick={sendMessage}>Send message</button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
