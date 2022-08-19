import React, { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import "./mainChat.css";
import ChatMessage from "./ChatMessage";

function MainChat() {
  const inputRef = useRef(null);
  const [prints, setPrints] = useState([]);
  const [msg, setMsg] = useState("");

  function handleClick() {
    setMsg(inputRef.current.value);
    ws.send(JSON.stringify({
      "meta_attributes":"react",
      "media_link":"http://www.doogle.com/",
       "message_text":"hi team all good11111"
  }))
  }

  var ws = new WebSocket(
    "ws://localhost:8001/msg/channel/?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjYwOTE2NDg5LCJpYXQiOjE2NjA4MzAwODksImp0aSI6ImE5OTQ5ODZhZDE4MjQxMzc5MDU5NmY0MDdiMjFjNDcyIiwidXNlcl9pZCI6MX0.cqflQryF1ro-CqOvErcvqD-HmxdtpEFwzzGlgIF4NVI&roomname=class8"
  );

  useEffect(() => {
    ws.onopen = function open() {
      console.log("web socket connection created!!");
    };
  }, []);

  useEffect(() => {
    ws.onmessage = (evt) => {
      // listen to data sent from the websocket server
      const message = JSON.parse(evt.data);
      // setState({dataFromServer: message})
      setPrints(message);
    };
  }, []);



  return (
    <>
      {/* Page content */}
      <div className="content">


        <ChatMessage msg={prints} />

        {msg == "" ? null : (
          <div className="container darker">
            <img
              src="https://www.w3schools.com/w3images/avatar2.png"
              alt="Avatar"
              className="right"
            />
            <span className="name right">Me</span>
            <p>{msg}</p>

            <span className="time-left">11:01</span>
          </div>
        )}


        <div className="sticky">
        <input
          ref={inputRef}
          className="text-box"
          id="inp"
          type="text"
          placeholder="Enter Text Here..."
        />
        <button onClick={handleClick}>send</button>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={25}
          height={25}
          fill="currentColor"
          className="bi bi-mic-fill"
          viewBox="0 0 16 16"
        >
          <path d="M5 3a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0V3z" />
          <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5z" />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={25}
          height={25}
          fill="currentColor"
          className="bi bi-heart"
          viewBox="0 0 16 16"
        >
          <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z" />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={25}
          height={25}
          fill="currentColor"
          className="bi bi-image"
          viewBox="0 0 16 16"
        >
          <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
          <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z" />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={25}
          height={25}
          fill="currentColor"
          className="bi bi-folder2"
          viewBox="0 0 16 16"
        >
          <path d="M1 3.5A1.5 1.5 0 0 1 2.5 2h2.764c.958 0 1.76.56 2.311 1.184C7.985 3.648 8.48 4 9 4h4.5A1.5 1.5 0 0 1 15 5.5v7a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 12.5v-9zM2.5 3a.5.5 0 0 0-.5.5V6h12v-.5a.5.5 0 0 0-.5-.5H9c-.964 0-1.71-.629-2.174-1.154C6.374 3.334 5.82 3 5.264 3H2.5zM14 7H2v5.5a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5V7z" />
        </svg>
        </div>
      </div>
    </>
  );
}

export default MainChat;
