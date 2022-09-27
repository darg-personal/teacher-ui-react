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
import { Card, Dropdown } from "react-bootstrap";
import IconButton from "@mui/material/IconButton";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CardHeader from "react-bootstrap/esm/CardHeader";
import CancelSharpIcon from "@mui/icons-material/CancelSharp";

import { ChatHeader, ImageShow, ImageView, ImgUpload, TextView } from "./templates/MainChat/Chat";
import Record from "./Recorder";

function MainChat(props) {

  let Token = localStorage.getItem("token");
  let navigate = useNavigate();
  let loggedUser = JSON.parse(localStorage.getItem("user"));
  const profileSrc = localStorage.getItem("loginUserImage")

  // Variables
  const inputRef = useRef(null);
  const scrollBottom = useRef(null);
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [messageCount, setMessageCount] = useState(0);
  // const [receiveMessageCount, setReceiveMessageCount] = useState(1);
  // const [receiveMessageCountDict, setReceiveMessageCountDict] = useState({});
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
  const isConnected = props.isConnected;
  const receiveMessageCountDictProp = props.receiveMessageCountDict;

  var tempDict = {};
  const recieveMessages = (chatroomId, username) => {
    const uniqeId = chatroomId + username;
    console.log(tempDict, "receiveMessageCountDict");
    var recCount = 0;
    if (tempDict[uniqeId]) {
      recCount = tempDict[uniqeId] + 1;
    } else {
      recCount = 1;
    }

    var countDict = {};
    if (receiveMessageCountDictProp) {
      countDict[uniqeId] = recCount;
      tempDict = countDict
      props.receiveMessageCount({
        receiveMessageCountDict: countDict,
        uniqeId,
      });
    }
      
  };

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
        if (message.count > 0)
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
      const message = JSON.parse(JSON.stringify(evt.data));
      const receivedObj = JSON.parse(message);
      console.log(receivedObj.channel, "=========on message========");

      if (chatroomId === receivedObj.channel.id && isConnected == 0) {
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
      recieveMessages(
        // receiveMessageCountDict,
        receivedObj?.channel.id,
        receivedObj?.channel.name
      );

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
        .post(`${utils.getHost()}/profile/upload`, formData)
        .then((resp) => {
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


  const ChatOptions = () => {
    return (
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
    )
  }
  const onStopRecording = async (recording) => {
    let formData = new FormData();
    formData.append("file", recording,"audio.mp3");
    await axios
      .post(`${utils.getHost()}/profile/upload`, formData)
      .then((resp) => {
        let file_url = resp.data.file_url;
        ws.send(
          JSON.stringify({
            meta_attributes: "react",
            message_type: "audio/mpeg",
            media_link: file_url ? file_url : null,
            message_text: inputRef.current.value ? inputRef.current.value : "",
          })
        );

        let messageDate = new Date();
        let timeNow = messageDate.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        });
        const date = messageDate.toLocaleDateString("en-US", {
          weekday: "short",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
        
        
        setState({ file: false });
        document.getElementById("inp").value = "";
      })
      .catch((resp) => {
        // setState({ file: false });

        alert("connection is breaked");
      });
  };

  return (
    <div className="chatroom">
      <div className="profile-header">
        <div className="header-chat">
          <ListItemAvatar onClick={() => props.show({ show: true, type: type, chatroomId: chatroomId, websocket: ws })}>
            <Avatar alt={chatroom} src={getChatImage} />
          </ListItemAvatar>
          <li className="" style={{ color: 'white', fontWeight: 'bold' }} >{chatroom}</li>

        </div>
      </div>

      <div className="position-fixed  end-0">
        <ChatOptions />
      </div>
      {load ? <Loader /> : null}

      {state.file ? (
        <>
          <CancelSharpIcon style={{ flex: 1, marginLeft: '90%', position: 'relative' }} onClick={() => {
            setState({
              file: null,
              filePreviewUrl: null,
            });
            setIsSelected(false)
          }} color="primary"
            fontSize="large" />
          <ImageShow filePreviewUrl={state.filePreviewUrl} />
        </>
      ) : (

        <div
          className="content"
          id="scroll"
          ref={scrollBottom}
          onScroll={onScroll}
        >
          {messages.map((e, i) => {
            return (
              <div key={e?.sender + i}
                style={{
                  marginTop: '2%',
                  overflow: 'auto'
                }}>
                {e.message_type === 'group-info-update' ?
                  <div id="center">
                    <div className=" user-add-remove" >
                      <p >{`${e.message}`}</p>
                    </div>
                  </div>
                  :
                  <div>
                    {e.sender === loggedUser.username ? (
                      <div >
                        {e.media_link ? (
                          <ImageView type={e.message_type} image={e.media_link} profile={profileSrc} text={e.message} sender={e.sender} time={e.time} />
                        ) : (
                          <TextView sender={'Me'} profile={profileSrc} text={e.message} time={e.time} />
                        )}
                      </div>
                    ) : (
                      <div  >
                        {e.media_link ? (
                          <ImageView  type={e.message_type} image={e.media_link} profile={e.profile} text={`${e.message}`} sender={e.sender} time={e.time} float={'left'} />
                        ) : (
                          <TextView sender={e.sender} profile={e.profile} text={e.message} time={e.time} float={'left'} />
                        )}
                      </div>
                    )}
                  </div>
                }
                {/* <hr/> */}
              </div>
            );
          })}

          <Outlet />
        </div>
      )
      }
      {isConnected == 0 ?
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
            <ImgUpload onChange={photoUpload} />
            <button onClick={handleClick} className="btn btn-outline-success">
              send
            </button>
            <Record onStopRecording={onStopRecording}></Record>
          </form>
        </div>
        :
        <Card style={{ marginLeft: '25%', alignSelf: 'center' }}>
          <p style={{ alignSelf: 'center' }}>
            Please Join The Group to chat
          </p>
        </Card>
      }
    </div >
  );
}

export default MainChat;
