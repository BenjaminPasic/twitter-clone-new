import { io } from "socket.io-client";
import { useEffect, useState, useRef } from "react";
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
  const chatInputRef = useRef(null);
  const { data: users } = useQuery("follows", findEveryoneUserFollows, {
    cacheTime: 0,
  });

  const handleScroll = () => {
    window.scrollTo({
      top: chatInputRef.offsetTop,
      left: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    handleScroll();
    if (currentUser) {
      customAxios
        .get("/conversation/convoInfo", {
          params: {
            followeeId: currentUser.id,
          },
        })
        .then((res) => {
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
    if (chatInput) {
      setDbMessages((prevState) => [
        ...prevState,
        { message: chatInput, received: false },
      ]);
      socket.emit("send-message", chatInput, currentRoomId, currentUser.id);
    }
  };

  const handleUsernameClick = (followee) => {
    setCurrentUser(followee);
    setDbMessages(undefined);
    setMessages([]);
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
          {dbMessages &&
            dbMessages.map((message, index, messageArray) => {
              if (message.received === true) {
                if (index === 0) {
                  return (
                    <span
                      style={{ marginBottom: "2px" }}
                      className="received-message-container"
                    >
                      <div className="received-message">{message.message}</div>
                      <Avatar>
                        {currentUser.username.charAt(0).toUpperCase()}
                      </Avatar>
                    </span>
                  );
                }
                if (
                  messageArray[index - 1 < 0 ? 0 : index - 1].received === true
                ) {
                  return (
                    <span className="received-message-container-no-margin">
                      <div className="received-message">{message.message}</div>
                      <Avatar
                        sx={{
                          background: "#2c2633",
                          color: "#2c2633",
                        }}
                      >
                        nothing
                      </Avatar>
                    </span>
                  );
                } else {
                  return (
                    <span className="received-message-container">
                      <div className="received-message">{message.message}</div>
                      <Avatar>
                        {currentUser.username.charAt(0).toUpperCase()}
                      </Avatar>
                    </span>
                  );
                }
              } else {
                if (index === 0) {
                  return (
                    <span
                      style={{ marginBottom: "2px" }}
                      className="sent-message-container"
                    >
                      <Avatar>You</Avatar>
                      <div className="sent-message">{message.message}</div>
                    </span>
                  );
                }
                if (
                  messageArray[index - 1 < 0 ? 0 : index - 1].received === false
                ) {
                  return (
                    <span className="sent-message-container-no-margin">
                      <Avatar
                        sx={{
                          background: "#2c2633",
                          color: "#2c2633",
                        }}
                      >
                        nothing
                      </Avatar>
                      <div className="sent-message">{message.message}</div>
                    </span>
                  );
                } else {
                  return (
                    <span className="sent-message-container">
                      <Avatar>
                        {currentUser.username.charAt(0).toUpperCase()}
                      </Avatar>
                      <div className="sent-message">{message.message}</div>
                    </span>
                  );
                }
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
