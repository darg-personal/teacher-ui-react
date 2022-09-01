import React, { createRef, useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { Link, Outlet, useParams } from "react-router-dom";
import "./mainChat.css";
import Avatar from "../../assets/Images/avatar.svg";
import axios from "axios";
import utils from "../../pages/auth/utils";

// console.log(Token,"***************************************");
function MainChat(props) {
  let Token = localStorage.getItem("token");
  let logged_user = JSON.parse(localStorage.getItem("user"));

  const inputRef = useRef(null);
  const scrollBottom = useRef(null);
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const chatroom = props.chatRoom;
  const chatroomId = props.chatRoomId;

  var ws = new WebSocket(
    `${utils.getWebsocketHost()}/msg/channel/?token=${Token}&roomname=${chatroom}`
  );

  useEffect(() => {
    if (scrollBottom) {
      scrollBottom.current.addEventListener("DOMNodeInserted", (event) => {
        const { currentTarget: target } = event;
        target.scroll({ top: target.scrollHeight, behavior: "smooth" });
      });
    }
  }, [chatroomId]);

  const onScroll = () => {
    if (scrollBottom.current) {
      const { scrollTop } = scrollBottom.current;
      if (scrollTop == 0) {
        setPage(page + 1);
        if (page * 10 <= count) {
          updateData(page + 1);
        }
      }
    }
  };

  function handleClick(event) {
    event.preventDefault();
    if (inputRef.current.value !== "") {
      ws.send(
        JSON.stringify({
          meta_attributes: "react",
          media_link: "http://www.doogle.com/",
          message_text: inputRef.current.value,
          user: "user1",
        })
      );
      document.getElementById("inp").value = "";
    }

    // const input1 = document.getElementById('inp').value
  }

  function fetchData() {
    axios
      .get(
        `${utils.getHost()}/chat/get/channel/paginated_messages/?channel=${chatroomId}&records=10&p=1`,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      )
      .then((res) => {
        const datas = JSON.stringify(res.data);
        const message = JSON.parse(datas);
        setCount(message.count);
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
            sender: receivedObj?.user.username || "NA",
            message: receivedObj?.message_text || "NA",
            time: time || "NA",
            images: receivedObj?.user_profile.image || null,
          };

          prevMsgs.push(msgObj);
        }
        // prevMsgs.push(...messages);
        setMessages([...prevMsgs]);
      });
  }

  function updateData(value) {
    axios
      .get(
        `${utils.getHost()}/chat/get/channel/paginated_messages/?channel=${chatroomId}&records=10&p=${value}`,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      )
      .then((res) => {
        const datas = JSON.stringify(res.data);
        const message = JSON.parse(datas);
        console.log(message,"00000");
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
            sender: receivedObj?.user.username || "NA",
            message: receivedObj?.message_text || "NA",
            time: time || "NA",
            images: receivedObj?.user_profile.image || null,
          };

          prevMsgs.push(msgObj);
        }

        setMessages([...prevMsgs, ...messages]);
      });
  }

  useEffect(() => {
    ws.onopen = function open() {
      setPage(1);
      setMessages([]);
      console.log("web socket connection created!!");
      setTimeout(() => {
        fetchData();
      }, 100);
    };
  }, [chatroom]);

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
        sender: receivedObj?.user.username || "NA",
        message: receivedObj?.message_text || "NA",
        time: time || "NA",
        images: receivedObj?.user_profile.image || Avatar,
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
      <div
        className="content"
        id="scroll"
        ref={scrollBottom}
        onScroll={onScroll}
      >
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

export default MainChat;
