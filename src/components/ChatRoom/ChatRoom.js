import React from 'react'
import { Navigate } from 'react-router-dom';
import Contact from './Contact'
import MainChat from './MainChat'
const Token = localStorage.getItem("token");

function ChatRoom() {
  return (
    <>
    {
      Token ?
      <div className="chatroom">
        <Contact/>
        <MainChat />
      </div>
      :
      <Navigate replace to="/login" />

    }
    </>
  )
}

export default ChatRoom


