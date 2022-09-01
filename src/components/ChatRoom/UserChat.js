import React, { createRef, useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { Link, Outlet, useParams } from "react-router-dom";
import "./mainChat.css";
import Avatar from "../../assets/Images/avatar.svg";
import axios from "axios";
import utils from "../../pages/auth/utils";

function UserChat(props) {
  let Token = localStorage.getItem("token");
  let logged_user = JSON.parse(localStorage.getItem("user"));
  const inputRef = useRef(null);
  const scrollBottom = useRef(null);
  const [messages, setMessages] = useState([]);
  const userName = props.userName;
  const receiverId = props.userId;
  const userType = props.type;



  var ws = new WebSocket(
    `${utils.getWebsocketHost()}/msg/user/?token=${Token}&receiver_id=${receiverId}`
  );

  useEffect(() => {
    if (scrollBottom) {
      scrollBottom.current.addEventListener("DOMNodeInserted", (event) => {
        const { currentTarget: target } = event;
        target.scroll({ top: target.scrollHeight, behavior: "smooth" });
      });
    }
  }, []);

  function handleClick(event) {
    event.preventDefault();
    ws.send(
      JSON.stringify({
        meta_attributes: "react",
        media_link: "http://www.doogle.com/",
        message_text: inputRef.current.value,

      })
    )
      let date = new Date();
      let timeNow = date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    let a = { sender: logged_user.username, message: inputRef.current.value, time: timeNow, images: 'https://cdn.icon-icons.com/icons2/2643/PNG/512/male_boy_person_people_avatar_icon_159358.png' }
    const prevMsgs = [...messages];
    prevMsgs.push(a);
    setMessages([...prevMsgs]);
    document.getElementById("inp").value = "";
  }

  useEffect(() => {
    ws.onopen = function open() {
      console.log("web socket connection created for User!!");
      axios
        .get(
          `${utils.getHost()}/chat/get/user/paginated_messages/?user=${receiverId}&records=10`,
          {
            headers: {
              Authorization: `Bearer ${Token}`,
            },
          }
        )
        .then((res) => {
          const datas = JSON.stringify(res.data);
          const message = JSON.parse(datas);
          const prevMsgs = [];

          for (let i = message.results.length - 1; i >= 0; i--) {
            const receivedObj = message.results[i];
            const massageTime = receivedObj?.created_at || "NA";
            const date = new Date(massageTime);
            const time = date.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            });

            const msgObj = {
              sender: receivedObj?.from_user.username || "NA",
              message: receivedObj?.message_text || "NA",
              time: time || "NA",
              images: receivedObj?.user_profile?.image || null,
            };

            prevMsgs.push(msgObj);
          }
          setMessages([...prevMsgs]);
        });
    };
  }, [userName]);

  useEffect(() => {
    ws.onmessage = (evt) => {
      // listen to data sent from the websocket server
      const message = JSON.parse(JSON.stringify(evt.data));
      const receivedObj = JSON.parse(message);
      const massageTime = receivedObj?.created_at || "NA";
      const date = new Date(massageTime);
      const time = date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });

      const msgObj = {
        sender: receivedObj?.from_user.username || "NA",
        message: receivedObj?.message_text || "NA",
        time: time || "NA",
        images: receivedObj?.user_profile.image|| Avatar,
      };
      const prevMsgs = [...messages];
      prevMsgs.push(msgObj);
      setMessages([...prevMsgs]);
    };
  }, [messages]);

  return (
    <>
      {/* Page content */}
      <div className="header">
        <Link to="/dashboard">
          {" "}
          <button
            type="button"
            className="btn btn-secondary position-fixed top-0 end-0"
          >
            Back to Home
          </button>
        </Link>
      </div>
      <div className="content" id="scroll" ref={scrollBottom}>
        {messages.map((e, i) => {
          return e.sender === logged_user.username ? (
            <div key={i} className="container darker" id="right">
              {e.images ? (
                <img src={e.images} alt="Avatar" className="right" />
              ) : (
                <img src={Avatar} alt="Avatar" className="right" />
              )}
              <span className="name right">Me</span>
              <p>{`${e.message}`}</p>

              <span className="time-right">{e.time}</span>
            </div>
          ) : (
            <div key={i} className="container" id="left">
              {e.images ? (
                <img src={e.images} alt="Avatar" className="right" />
              ) : (
                <img src={Avatar} alt="Avatar" className="right" />
              )}
              <span className="name right">{e.sender}</span>
              <p>{`${e.message}`}</p>
              <span className="time-left">{e.time}</span>
            </div>
          );
        })}

        <Outlet />
      </div>
      <div className="box">
        <form>
          <input
            ref={inputRef}
            className="input_text"
            id="inp"
            type="text"
            placeholder="Enter Text Here..."
            onKeyDown={(e) => e.key === "Enter" && handleClick}
          />
          <button onClick={handleClick} className="btn btn-outline-success">
            send
          </button>
        </form>
      </div>
    </>
  );
}

export default UserChat;