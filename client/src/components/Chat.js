import { Avatar, Button, TextField } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import { io } from "socket.io-client";
import customAxios from "../api/customAxios";
import { findEveryoneUserFollows } from "../api/followApi";
import "../css/Chat.css";
const socket = io.connect("https://twitter-clone-7wmm.onrender.com", {
  withCredentials: true,
});

const Chat = () => {
  const [chatInput, setChatInput] = useState("");
  const [dbMessages, setDbMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState("");
  const [currentRoomId, setCurrentRoomId] = useState("");
  const chatInputRef = useRef(null);
  const { data: users, isFetching } = useQuery(
    "follows",
    findEveryoneUserFollows,
    {
      cacheTime: 0,
    }
  );

  console.log(dbMessages);

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
      console.log("received message", message);
      setDbMessages((prevState) => [...prevState, { message, received: true }]);
    });
  }, [socket]);

  const sendMessage = () => {
    if (chatInput) {
      setDbMessages((prevState) => [
        ...prevState,
        { message: chatInput, received: false },
      ]);
      console.log("sent message", dbMessages);
      socket.emit("send-message", chatInput, currentRoomId, currentUser.id);
      setChatInput("");
    }
  };

  const handleUsernameClick = (followee) => {
    if (followee !== currentUser) {
      setCurrentUser(followee);
      setDbMessages([]);
    }
  };

  const handleInput = (e) => {
    setChatInput(e.target.value);
  };

  if (isFetching)
    return (
      <div className="chat">
        <div className="container">
          <div className="users">
            {users?.data.length > 0 ? (
              users.data.map((user, i) => {
                return (
                  <div
                    key={user.id}
                    className="user"
                    onClick={() => handleUsernameClick(user)}
                  >
                    <Avatar sx={{ background: "red" }}>
                      {user.username.charAt(0).toUpperCase()}
                    </Avatar>
                    <div className="name-container">
                      <p className="name">{user.name}</p>
                      <p className="username">@{user.username}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <h2 style={{ color: "white" }}>
                Follow someone to start chatting!
              </h2>
            )}
          </div>
          <div className="chat-interface">
            {dbMessages.length > 0 &&
              dbMessages
                .filter((message) => message.message !== null)
                .map((message, index, messageArray) => {
                  console.log(message);
                  if (message.received === true) {
                    if (index === 0) {
                      return (
                        <span
                          style={{ marginBottom: "2px" }}
                          className="received-message-container"
                          key={index}
                        >
                          <div className="received-message">
                            {message.message}
                          </div>
                          <Avatar>
                            {currentUser.username.charAt(0).toUpperCase()}
                          </Avatar>
                        </span>
                      );
                    }
                    if (
                      messageArray[index - 1].sender_id !== message.sender_id
                    ) {
                      return (
                        <span
                          style={{ marginBottom: "2px" }}
                          className="received-message-container"
                          key={index}
                        >
                          <div className="received-message">
                            {message.message}
                          </div>
                          <Avatar>
                            {currentUser.username.charAt(0).toUpperCase()}
                          </Avatar>
                        </span>
                      );
                    } else {
                      return (
                        <span
                          className="received-message-container-no-margin"
                          key={index}
                        >
                          <div className="received-message">
                            {message.message}
                          </div>
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
                    }
                  } else {
                    if (index === 0) {
                      return (
                        <span
                          key={index}
                          style={{ marginBottom: "2px" }}
                          className="sent-message-container"
                        >
                          <Avatar>You</Avatar>
                          <div className="sent-message">{message.message}</div>
                        </span>
                      );
                    }
                    if (
                      messageArray[index - 1].sender_id !== message.sender_id
                    ) {
                      return (
                        <span
                          key={index}
                          style={{ marginBottom: "2px" }}
                          className="sent-message-container"
                        >
                          <Avatar>You</Avatar>
                          <div className="sent-message">{message.message}</div>
                        </span>
                      );
                    } else {
                      return (
                        <span
                          className="sent-message-container-no-margin"
                          key={index}
                        >
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
                    }
                  }
                })}
            {/* {dbMessages &&
            dbMessages.map((message, index, messageArray) => {
              if (message.received === true) {
                if (index === 0) {
                  return (
                    <span
                      style={{ marginBottom: "2px" }}
                      className="received-message-container"
                      key={index}
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
                    <span
                      className="received-message-container-no-margin"
                      key={index}
                    >
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
                    <span className="received-message-container" key={index}>
                      <div className="received-message">{message.message}</div>
                      <Avatar>
                        {currentUser.username.charAt(0).toUpperCase()}
                      </Avatar>
                    </span>
                  );
                }
              } else {
                if (index === 0 && message.message !== null) {
                  return (
                    <span
                      key={index}
                      style={{ marginBottom: "2px" }}
                      className="sent-message-container"
                    >
                      <Avatar>You</Avatar>
                      <div className="sent-message">{message.message}</div>
                    </span>
                  );
                }
                if (
                  messageArray[index - 1 < 0 ? 0 : index - 1].received === false && message.message !== null
                ) {
                  return (
                    <span
                      className="sent-message-container-no-margin"
                      key={index}
                    >
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
                  if(message.message !== null){
                    return (
                      <span className="sent-message-container" key={index}>
                        <Avatar>You</Avatar>
                        <div className="sent-message">{message.message}</div>
                      </span>
                    );
                  }
                }
              }
            })} */}
            {
              <div className="chat-input">
                <TextField
                  variant="outlined"
                  sx={{
                    flex: "1",
                    "& .MuiInputBase-root": {
                      color: "white",
                    },
                  }}
                  size="small"
                  multiline
                  value={chatInput}
                  onChange={(e) => handleInput(e)}
                />
                <Button
                  onClick={sendMessage}
                  variant="contained"
                  disabled={
                    currentUser === undefined && currentRoomId === undefined
                  }
                >
                  {currentUser === undefined && currentRoomId === undefined
                    ? "Disabled"
                    : "Send"}
                </Button>
              </div>
            }
          </div>
        </div>
      </div>
    );
};

export default Chat;
