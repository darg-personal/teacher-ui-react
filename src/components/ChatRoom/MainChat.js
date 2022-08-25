import React, { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { Link, Outlet, useParams } from "react-router-dom";
import "./mainChat.css";
import Avatar from "../../assets/Images/avatar.svg";
import axios from "axios";
import utils from "../../pages/auth/utils";

function MainChat() {
  let token = localStorage.getItem("token");
  const inputRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [time, setTime] = useState("");
  let { chatroom } = useParams();
  console.log({ chatroom });

  function handleClick() {
    ws.send(
      JSON.stringify({
        meta_attributes: "react",
        media_link: "http://www.doogle.com/",
        message_text: inputRef.current.value,
        user: "user1",
      })
    );
  }

  var ws = new WebSocket(
    `${utils.getWebsocketHost()}/msg/channel/?token=${token}&roomname=${chatroom}`
  );

  useEffect(() => {
    ws.onopen = function open() {
      console.log("web socket connection created!!");
      // axios.get(`http://192.168.1.37:9000/chat/get/paginatedmessages/channel=2&records=10`)
      axios.get(`${utils.getHost()}/chat/get/paginatedmessages/channel=2&records=10`)
        .then((res) => {
          const datas = JSON.stringify(res.data);
          const message = JSON.parse(datas);
          console.log("4444", message.results);
          const prevMsgs = [...messages];
          for (let i = 0; i < message.results.length; i++) {
            const receivedObj = message.results[i]
            const massageTime = receivedObj?.created_at || "NA"
            console.log(massageTime);
            
             const date = new Date(massageTime);
             const time = date.toLocaleTimeString("en-US",{
               hour: "2-digit",
               minute: "2-digit",
             });
             console.log(time);
            const msgObj = {
              sender: receivedObj?.user.username || "NA",
              message: receivedObj?.message_text || "NA",
              time: time || "NA",
              images: receivedObj?.user_profile || "NA",
            };
            prevMsgs.push(msgObj);
          }
          setMessages([...prevMsgs]);
        });
    };
  }, [chatroom]);

  useEffect(() => {
    ws.onmessage = (evt) => {
      // listen to data sent from the websocket server
      const message = JSON.parse(JSON.stringify(evt.data));
      const receivedObj = JSON.parse(message);
      console.log(receivedObj);
      const massageTime = receivedObj?.created_at || "NA"
      console.log(massageTime);
       const date = new Date(massageTime);
       const time = date.toLocaleTimeString("en-US",{
         hour: "2-digit",
         minute: "2-digit",
       });
       console.log(time);

      const msgObj = {
        sender: receivedObj?.name || "NA",
        message: receivedObj?.message_text || "NA",
        time: time || "NA",
      };

      const prevMsgs = [...messages];
      prevMsgs.push(msgObj);
      setMessages([...prevMsgs]);
    };
  }, [messages]);

  return (
    <>
      {/* Page content */}
      <div className="content">
      
        <div className="position-relative close-btn">
          <Link to="/dashboard">
            {" "}
            <button
              type="button"
              className="btn btn-secondary position-absolute top-0 end-0"
            >
              Back to Home
            </button>
          </Link>
        </div>
        {messages.map((e, i) => {
          return e.sender == "admin01" ? (
            <div key={i} className="container darker" id="right">
              <img src={Avatar} alt="Avatar" className="right" />
              <span className="name right">Me</span>
              <p>{`${e.message}`}</p>

              <span className="time-right">{e.time}</span>
            </div>
          ) : (
            <div key={i} className="container" id="left">
              <img
                src={e.images}
                alt="Avatar"
                className="right"
              />
              <span className="name right">{e.sender}</span>
              <p>{`${e.message}`}</p>
              <span className="time-left">{e.time}</span>
            </div>
          );
        })}

        <Outlet />
      </div>
      <div className="box">
      <input
        ref={inputRef}
        className="input_text"
        id="inp"
        type="text"
        placeholder="Enter Text Here..."
      />
      <button onClick={handleClick} className="btn btn-outline-success">
        send
      </button>
    </div>
    </>
  );
}

export default MainChat;
