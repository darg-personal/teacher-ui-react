import React, { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { Link, Outlet } from "react-router-dom";
import "./mainChat.css";
import Avatar from "../../assets/Images/avatar.svg";
import axios from "axios";
import { jssPreset } from "@material-ui/core";

function MainChat() {
  const inputRef = useRef(null);
  const [messages, setMessages] = useState([]);
  // 👇️ With PM / AM
  // let today = new Date();
  // const timeWithPmAm = today.toLocaleTimeString("en-US", {
  //   hour: "2-digit",
  //   minute: "2-digit",
  // });

  function handleClick() {
    ws.send(
      JSON.stringify({
        meta_attributes: "react",
        media_link: "http://www.doogle.com/",
        message_text: inputRef.current.value,
        user: "user1",
      })
    );
    // const input1 = document.getElementById('inp').value
    // document.getElementById('inp').value = ''
  }

  var ws = new WebSocket(
    "ws://192.168.1.37:8000/msg/channel/?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjYxMzE2MjQ2LCJpYXQiOjE2NjEyMjk4NDYsImp0aSI6ImMwZWExNzg1ZDI3ZTRiMzA4Y2EzMzMzNzA5ZTBmNmQyIiwidXNlcl9pZCI6MX0.WCerytXPcQya4_S8b3F4-ksAXVN8mOtzuKz-ga2mj7Y&roomname=class8"
  );

  useEffect(() => {
    ws.onopen = function open() {
      console.log("web socket connection created!!");
      axios.get(`http://192.168.1.37:8000/chat/get/nummsg/user/?p=1&records=10`)
      .then(res => {
        const datas = JSON.stringify(res.data);
        const data = JSON.parse(datas);
        console.log(data);
        const dataObj = {
            resultData: data?.results || "NA",
        }
        console.log(dataObj.resultData);

        // setMessages(dataObj.resultData)
      })
    };

  }, []);



  useEffect(() => {
    ws.onmessage = (evt) => {
      // listen to data sent from the websocket server
      const message = JSON.parse(JSON.stringify(evt.data));
      const receivedObj = JSON.parse(message);
      console.log(receivedObj);
      const msgObj = {
        sender: receivedObj?.name || "NA",
        message: receivedObj?.message_text || "NA",
        time: receivedObj?.created_at || "NA",
      };

      const prevMsgs = [...messages];
      prevMsgs.push(msgObj);
      setMessages([...prevMsgs]);

      console.log(msgObj.time);
      const date = new Date(msgObj.time);
      const time = date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
      console.log(time);

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
          >Back to Home</button>
        </Link>
      </div>  
        {messages.map((e, i) => {
          return e.sender == "admin01" ? (
            <div key={i} className="container darker" id="right">
              <img src={Avatar} alt="Avatar" className="right" />
              <span className="name right">Me</span>
              <p>{`${e.message}`}</p>

              <span className="time-right">{}</span>
            </div>
          ) : (
            <div key={i} className="container" id="left">
              <img
                src="https://www.w3schools.com/w3images/avatar2.png"
                alt="Avatar"
                className="right"
              />
              <span className="name right">{e.sender}</span>
              <p>{`${e.message}`}</p>
              <span className="time-left">{}</span>
            </div>
          );
        })}

        <div
          className="box"
          // style={{
          //   position: "absolute",
          //   bottom: 0,
          //   width: "calc(100% - 330px)",
          // }}
        >
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
        <Outlet/>
      </div>

    </>
  );
}

export default MainChat;
