import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import Contact from "./Contact";
import MainChat from "./MainChat";
const Token = localStorage.getItem("token");

function ChatRoom() {
  const [chatRoom, setChatRoom] = useState();
  const [chatRoomId, setChatRoomId] = useState();
  const [type, setType] = useState();

  const pull_data = (data) => {
    console.log(data,"99877654456700000000");
    setChatRoom(data.name);
    setChatRoomId(data.id);
    setType(data.type);
  };
  return (
    <>
      {Token ? (
        <div className="chatroom">
          <Contact type={pull_data} />
          {type == "Channel" ? (
            <MainChat chatRoom={chatRoom} chatRoomId={chatRoomId} type={type} />
          ) : null}
        </div>
      ) : (
        <Navigate replace to="/login" />
      )}
    </>
  );
}

export default ChatRoom;
