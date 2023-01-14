import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { findEveryoneUserFollows } from "../api/followApi";
import { TextField, Button } from "@mui/material";
import customAxios from "../api/customAxios";
import "../css/Chat.css";
import { Avatar } from "@mui/material";
const socket = io.connect("http://localhost:3001", { withCredentials: true });

const Chat = () => {
  const [chatInput, setChatInput] = useState("");
  const [dbMessages, setDbMessages] = useState(undefined);
  const [messages, setMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentRoomId, setCurrentRoomId] = useState(undefined);
  const { data: users } = useQuery("follows", findEveryoneUserFollows, {
    cacheTime: 0,
  });

  useEffect(() => {
    if (currentUser) {
      customAxios
        .get("/conversation/convoInfo", {
          params: {
            followeeId: currentUser.id,
          },
        })
        .then((res) => {
          console.log(res);
          setCurrentRoomId(res.data[0].room_id);
          if (Object.keys(res.data[0]).length > 1) {
            setDbMessages(res.data);
          }
        });
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentRoomId) socket.emit("join-room", currentRoomId);
  }, [currentRoomId]);

  useEffect(() => {
    socket.on("receive-message", (message) => {
      setMessages((prevState) => [
        ...prevState,
        { message: message, received: true },
      ]);
    });
  }, [socket]);

  /*useEffect(() => {
    return () => {
      if (socket) socket.close();
    };
  }, []);*/

  const sendMessage = () => {
    setMessages((prevState) => [
      ...prevState,
      { message: chatInput, received: false },
    ]);
    socket.emit("send-message", chatInput, currentRoomId, currentUser.id);
  };

  const handleUsernameClick = (followee) => {
    setCurrentUser(followee);
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
                <div className="user" onClick={() => handleUsernameClick(user)}>
                  <Avatar sx={{ background: "red" }}>
                    {user.username.charAt(0).toUpperCase()}
                  </Avatar>
                  <div className="name-container">
                    <p className="name">{user.name}</p>
                    <p className="username">@{user.username}</p>
                  </div>
                </div>
              );
            })}
        </div>
        <div className="chat-interface">
          {/*database messages*/}
          {dbMessages &&
            dbMessages.map((message) => {
              if (message.received === true) {
                return (
                  <p key={message.id} className="received">
                    {message.message}
                  </p>
                );
              } else {
                return (
                  <p key={message.id} className="sent">
                    {message.message}
                  </p>
                );
              }
            })}
          {/*local messages*/}
          {messages.length > 0 &&
            messages.map((message, i) => {
              if (message.received === true) {
                return (
                  <p key={i} className="received">
                    {message.message}
                  </p>
                );
              } else {
                return (
                  <p key={i} className="sent">
                    {message.message}
                  </p>
                );
              }
            })}
          <div className="chat-input">
            <TextField
              variant="outlined"
              sx={{ flex: "1" }}
              size="small"
              multiline
              onChange={(e) => handleInput(e)}
            />
            {currentUser === undefined && currentRoomId === undefined ? (
              <Button variant="contained" disabled>
                Disabled
              </Button>
            ) : (
              <Button variant="contained" onClick={sendMessage}>
                Send message
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
