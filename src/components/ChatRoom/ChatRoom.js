import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import Contact from "./Contact";
import MainChat from "./MainChat";
import UserChat from "./UserChat";
const Token = localStorage.getItem("token");

function ChatRoom() {
  const [chatRoom, setChatRoom] = useState();
  const [chatRoomId, setChatRoomId] = useState();
  const [receiveMessage, setReceiveMessage] = useState();
  const [type, setType] = useState(); 
  const [queue, setQueue] = useState([]); 
  localStorage.setItem("queue",queue)
  const pull_data = (data) => {
    setChatRoom(data.name);
    setChatRoomId(data.id);
    setType(data.type); 
   
  };
  const receiveMessages = (data) =>{
    setReceiveMessage(data.receiveMessageCount)
    console.log(data.receiveMessageCount,'.........data');
  }

  return (
    <>
      {Token ? (
        <div className="chatroom">
          <Contact type={pull_data} receiveMessage={receiveMessage}/>
          {type == "Channel" ? (
            <MainChat chatRoom={chatRoom} chatRoomId={chatRoomId} type={type} receiveMessages={receiveMessages}/>
          ) : type == "user" ? (
            <UserChat userName={chatRoom} userId={chatRoomId} type={type} />
          ) : null}
        </div>
      ) : (
        <Navigate replace to="/login" />
      )}
    </>
  );
}

export default ChatRoom;
