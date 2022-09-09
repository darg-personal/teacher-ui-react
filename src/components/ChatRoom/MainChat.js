import React, { createRef, useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { Link, Outlet } from "react-router-dom";
import "./mainChat.css";
import Avatar from "../../assets/Images/avatar.svg";
import axios from "axios";
import utils from "../../pages/auth/utils";
import Loader from "./Loader";
import { useNavigate } from "react-router-dom";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { Dropdown } from "react-bootstrap";
function MainChat(props) {

  let Token = localStorage.getItem("token");
  let navigate = useNavigate();
  let loggedUser = JSON.parse(localStorage.getItem("user"));

  // Variables
  const inputRef = useRef(null);
  const scrollBottom = useRef(null);
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [messageCount, setMessageCount] = useState(0);
  const [receiveMessageCount, setReceiveMessageCount] = useState(1);
  const [load, setLoad] = useState(false);

  // Props
  const chatroom = props.chatRoom;
  const ws = props.websocket;
  const chatroomId = props.chatRoomId;
  const type = props.type;
  const getChatImage = props.getChatImage;

  useEffect(() => {
    setPage(1);
    console.log(`web socket connection created for channel ${chatroom}!!`);
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
        const responseData = JSON.stringify(res.data);
        const message = JSON.parse(responseData);
        setMessageCount(message.count);
        const prevMsgs = [];
        for (let i = message.results.length - 1; i >= 0; i--) {
          const receivedObj = message.results[i];
          const receivedDate = receivedObj?.created_at || "NA";
          const messageDate = new Date(receivedDate);
          const time = messageDate.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          });
          const date = messageDate.toLocaleDateString("en-US", {
            weekday: "short",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          });

          const msgObj = {
            sender: receivedObj?.user.username || "NA",
            message: receivedObj?.message_text || "NA",
            time: time || "NA",
            date: date || "NA",
            profile: receivedObj?.user_profile.image || null,
          };

          prevMsgs.push(msgObj);
        }
        setMessages([...prevMsgs]);
      })
      .catch((error) => {
        console.log("error : ", error);
      }).finally(() => {
        setLoad(false);
      })
  }, [chatroom]);

  useEffect(() => {
    ws.onmessage = (evt) => {
      console.log("=========on message========");
      const message = JSON.parse(JSON.stringify(evt.data));
      const receivedObj = JSON.parse(message);
      console.log(receivedObj.channel, "=========on message========");

      if (chatroomId === receivedObj.channel.id) {
        const receivedDate = receivedObj?.created_at || "NA";
        const messageDate = new Date(receivedDate);
        const time = messageDate.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        });
        const date = messageDate.toLocaleDateString("en-US", {
          weekday: "short",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
        const msgObj = {
          sender: receivedObj?.user.username || "NA",
          message: receivedObj?.message_text || "NA",
          time: time || "NA",
          date: date || "NA",
          profile: receivedObj?.user_profile.image || Avatar,
        };
        const prevMsgs = [...messages];
        prevMsgs.push(msgObj);
        setMessages([...prevMsgs]);
      }
    };
  }, [messages]);

  function handleClick(event) {
    event.preventDefault();
    if (inputRef.current.value !== "") {
      ws.send(
        JSON.stringify({
          meta_attributes: "react",
          message_type: 'text',
          media_link: null,
          message_text: inputRef.current.value,
          user: "user1",
        })
      );
      document.getElementById("inp").value = "";
    }
  }

  //OnScroll fetch more data from pagination api
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
        const responseData = JSON.stringify(res.data);
        const message = JSON.parse(responseData);
        const prevMsgs = [];
        for (let i = message.results.length - 1; i >= 0; i--) {
          const receivedObj = message.results[i];
          const massageTime = receivedObj?.created_at || "NA";
          const messageDate = new Date(massageTime);
          const time = messageDate.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          });
          const date = messageDate.toLocaleDateString("en-US", {
            weekday: "short",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          });

          const msgObj = {
            sender: receivedObj?.user.username || "NA",
            message: receivedObj?.message_text || "NA",
            time: time || "NA",
            date: date || "NA",
            profile: receivedObj?.user_profile.image || null,
          };

          prevMsgs.push(msgObj);
        }
        setLoad(false);
        setMessages([...prevMsgs, ...messages]);
      }).finally(() => {
        setLoad(false);
      })
  }
  //onScroll
  const onScroll = () => {
    if (scrollBottom.current) {
      const { scrollTop } = scrollBottom.current;
      if (scrollTop === 0) {
        setPage(page + 1);
        if (page * 10 <= messageCount) {
          setLoad(true);
          updateData(page + 1);
        }
      }
    }
  };
  //useEffect
  useEffect(() => {
    if (scrollBottom) {
      scrollBottom.current.addEventListener("DOMNodeInserted", (event) => {
        const { currentTarget: target } = event;
        target.scroll({ top: target.scrollHeight, behavior: "smooth" });
      });
    }
  }, []);
  return (
    <>
      {/* Page content */}
      <ul className="profile-header">
        <div className="header-chat">
          <div className="classes">
            <div>
              <AiOutlineArrowLeft
                style={{ color: "#fff", height: "30" }}
                onClick={() => {
                  navigate("/dashboard");
                }}
              />
            </div>
            <li onClick={() => props.show({ show: true, type: type })}>
              <img src={getChatImage} alt="Avatar" className="avatar" />
            </li>

            <li className="" style={{color : 'white',fontWeight:'bold'}} >{chatroom}</li>
          </div>
        </div>
      </ul>
      <div className="position-fixed  end-0">
        <div className="three-dots">
          <i className="bi bi-three-dots-vertical"></i>

          <Dropdown>
            <Dropdown.Toggle variant="white" id="dropdown-basic">
              <BiDotsVerticalRounded
                id="dropdown-basic"
                style={{ color: "#FFF" }}
              ></BiDotsVerticalRounded>
            </Dropdown.Toggle>

            <Dropdown.Menu className="drop">
              <Dropdown.Item>Settings</Dropdown.Item>
              <Dropdown.Item>Details</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
      {load ? <Loader /> : null}
      <div
        className="content"
        id="scroll"
        ref={scrollBottom}
        onScroll={onScroll}
      >
        {messages.map((e, i) => {
          return (<>
            {/* <div key={i} className="container darker" id="center">
            {e.date}
           </div> */}
            {e.sender === loggedUser.username ? (
              <div key={i} className="container darker" id="right">
                {e.profile ? (
                  <img src={e.profile} alt="Avatar" className="right responsive-image" />
                ) : (
                  <img src={Avatar} alt="Avatar" className="right responsive-image" />
                )}
                <span className="name right">Me</span>
                <p>{`${e.message}`}</p>

                <span className="time-right">
                  {e.time}
                </span>
              </div>
            ) : (
              <div key={i} className="container" id="left">
                {e.profile ? (
                  <img src={e.profile} alt="Avatar" className="right responsive-image" />
                ) : (
                  <img src={Avatar} alt="Avatar" className="right responsive-image" />
                )}
                <span className="name right">{e.sender}</span>
                <p>{`${e.message}`}</p>
                <span className="time-left">
                  {e.time}
                </span>
              </div>
            )}
          </>

          )
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
