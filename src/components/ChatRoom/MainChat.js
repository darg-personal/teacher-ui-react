import React, { createRef, useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { Link, Outlet } from "react-router-dom";
import "./mainChat.css";
import axios from "axios";
import utils from "../../pages/auth/utils";
import Loader from "./Loader";
import { useNavigate } from "react-router-dom";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { Dropdown } from "react-bootstrap";
import IconButton from "@mui/material/IconButton";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import AttachFileIcon from '@mui/icons-material/AttachFile';

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
  const [selectedFile, setSelectedFile] = useState();
  const [isSelected, setIsSelected] = useState(false);
  const [state, setState] = useState({
    file: "",
    filePreviewUrl:
      null,
  });

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
          const message_type = receivedObj?.message_type;
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
            message_type: message_type || "message/text",
            media_link: receivedObj?.media_link || null,
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
        const message_type = receivedObj?.message_type;

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
          message_type: message_type || "message/text",
          media_link: receivedObj?.media_link || null,
        };
        const prevMsgs = [...messages];
        prevMsgs.push(msgObj);
        setMessages([...prevMsgs]);
      }
    };
  }, [messages]);

  async function handleClick(event) {
    event.preventDefault();
    let context_type;
    let file_url;
    if (isSelected) {
      let formData = new FormData();
      formData.append("file", selectedFile);
      await axios
        .post(`${utils.getHost()}/s3_uploader/upload`, formData)
        .then((resp) => {
          console.log(resp.data.content_type);
          context_type = resp.data.content_type;
          file_url = resp.data.file_url;
        })
        .then(() => {
          setState({ file: false });
        })
        .catch((resp) => {
          setState({ file: false });

          alert("connection is breaked");
        });
    } else {
      context_type = null;
      file_url = null;
    }
    if (inputRef.current.value !== "" || isSelected) {
      ws.send(
        JSON.stringify({
          meta_attributes: "react",
          message_type: context_type ? context_type : "message/text",
          media_link: file_url ? file_url : null,
          message_text: inputRef.current.value ? inputRef.current.value : "",
        })
      );
      setIsSelected(false);
      setState({ file: false });
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
          const message_type = receivedObj?.message_type;

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
            message_type: message_type || "message/text",
            media_link: receivedObj?.media_link || null,
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

  const ImageView = ({ image, text }) => {
    console.log(image, text, "-=-");
    return (
      <div class="share-pic">
        <img
          className="share-pic-text"
          src={image}
        // alt="Geeks Image"
        />
        <p>{text !== "NA" ? text : null}</p>
      </div>
    );
  };

  const ImgUpload = ({ onChange, src }) => {
    return (
      <IconButton color="primary" aria-label="upload picture" component="label">
        <input hidden accept="image/*" type="file" onChange={onChange} />
        <AttachFileIcon />
      </IconButton>
    );
  };

  const ImageShow = () => {
    console.log("iisiisiii");
    return (
      <div className="image-show-view">
        <label className="centered-view">
          <img  
            src={state.filePreviewUrl}
            style={{ height: "80%", width: "80%" }}
          />
        </label>
      </div>
    );
  };

  const photoUpload = (event) => {
    event.preventDefault();
    const reader = new FileReader();
    const file = event.target.files[0];
    setSelectedFile(event.target.files[0]);
    setIsSelected(true);
    reader.onloadend = () => {
      setState({
        file: file,
        filePreviewUrl: reader.result,
      });
    };
    reader.readAsDataURL(file);
  };

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
              <ListItemAvatar>
                <Avatar alt={chatroom} src={getChatImage} />
              </ListItemAvatar>
            </li>

            <li className="" style={{ color: 'white', fontWeight: 'bold' }} >{chatroom}</li>
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

      {state.file ? (
        <ImageShow />
      ) : (

        <div
          className="content"
          id="scroll"
          ref={scrollBottom}
          onScroll={onScroll}
        >
          {messages.map((e, i) => {
            return (
              <div>
                {e.sender === loggedUser.username ? (
                  <div>
                    <div key={i} className="container darker" id="right">
                      <ListItemAvatar style={{ float: 'right' }}>
                        <Avatar alt={e.sender} src={e.profile} style={{
                          marginLeft: '10px',
                          height: '35px',
                          width: '35px'
                        }} />
                      </ListItemAvatar>
                      <span className="name right">Me</span>
                      {e.media_link ? (
                        <ImageView image={e.media_link} text={`${e.message}`} />
                      ) : (
                        <p>{`${e.message}`}</p>
                      )}

                      <span className="time-right">{e.time}</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <div key={i} className="container" id="left">
                      <span className="name right">{e.sender}</span>
                      <ListItemAvatar>
                        <Avatar alt={e.sender} src={e.profile} style={{
                          marginLeft: '10px',
                          height: '35px',
                          width: '35px'
                        }} />
                      </ListItemAvatar>
                      {e.media_link ? (
                        <ImageView image={e.media_link} text={`${e.message}`} />
                      ) : (
                        <p>{`${e.message}`}</p>
                      )}
                      <span className="time-left">{e.time}</span>
                    </div>

                  </>
                )}
              </div>
            );
          })}

          <Outlet />
        </div>
      )}

      <div className="box">
        <form>
          <ImgUpload onChange={photoUpload} src={state.filePreviewUrl} />
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
