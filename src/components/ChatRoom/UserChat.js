import React, { createRef, useState } from "react";
import ReactDOM from "react-dom";
import { useEffect } from "react";
import { useRef } from "react";
import { Link, Outlet, useParams } from "react-router-dom";
import "./mainChat.css";
import axios from "axios";
import utils from "../../pages/auth/utils";
import Loader from "./Loader";
import { useNavigate } from "react-router-dom";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { Button, Dropdown } from "react-bootstrap";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import VideocamIcon from "@mui/icons-material/Videocam";
import {
  ChatHeader,
  ImageShow,
  ImageView,
  ImgUpload,
  TextView,
  Answer,
} from "./templates/MainChat/Chat";
import CancelSharpIcon from "@mui/icons-material/CancelSharp";
import Record from "./Recorder";
import { JitsiMeeting } from "@jitsi/react-sdk";
import { createPortal } from "react-dom";
import { VideoCall } from "@mui/icons-material";
import CallIcon from '@mui/icons-material/Call';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { FullScreen } from "react-full-screen";
import Modal from 'react-bootstrap/Modal';

function UserChat(props) {
  // const handle = useFullScreenHandle();
  let Token = localStorage.getItem("token");
  let loggedUser = JSON.parse(localStorage.getItem("user"));
  const profileSrc = localStorage.getItem("loginUserImage");
  let navigate = useNavigate();

  const inputRef = useRef(null);
  const scrollBottom = useRef(null);
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [messageCount, setMessageCount] = useState(0);
  const [load, setLoad] = useState(false);
  const getChatImage = props.getChatImage;
  const [selectedFile, setSelectedFile] = useState();
  const [isSelected, setIsSelected] = useState(false);
  const [state, setState] = useState({
    file: "",
    filePreviewUrl:
      "https://github.com/OlgaKoplik/CodePen/blob/master/profile.jpg?raw=true",
  });
  const [call, setCall] = useState(false);
const [videoLink, setVideoLink] = useState(null);

  const userName = props.userName;
  var receiverId = props.userId;
  const type = props.type;
  var ws = props.websocket;
  var tempDict = {};

  useEffect(() => {
    if (scrollBottom) {
      scrollBottom.current.addEventListener("DOMNodeInserted", (event) => {
        const { currentTarget: target } = event;
        target.scroll({ top: target.scrollHeight, behavior: "smooth" });
      });
    }
  }, [messages]);

  const onScroll = () => {
    if (scrollBottom.current) {
      const { scrollTop } = scrollBottom.current;
      if (scrollTop == 0) {
        setPage(page + 1);
        if (page * 10 <= messageCount) {
          setLoad(true);
          updateData(page + 1);
        }
      }
    }
  };

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
      let a = {
        sender: loggedUser.username,
        message: inputRef.current.value,
        time: timeNow,
        date: date,
        media_link: file_url ? file_url : null,
        message_type: context_type ? context_type : "message/text",
        profile: getChatImage,
      };
      const prevMsgs = [...messages];
      prevMsgs.push(a);
      setMessages([...prevMsgs]);
      setIsSelected(false);
      setOpen(false);
      setState({ file: false });
      document.getElementById("inp").value = "";
    }
  }

  const videoNode = document.createElement("div");
  function videoCall(event) {
    event.preventDefault();
    console.log("Video call");
    document.body.appendChild(videoNode);
    videoNode.style.height = "300px";
    videoNode.style.width = "600px";
    videoNode.style.position = "relative"
    const PopupContent = () => {
      ws.send(
        JSON.stringify({
          meta_attributes: "react",
          message_type: "message/videocall",
          media_link: "https://18.117.227.68:9011/videocall",
          message_text: "",
        })
      );
      return (



        <div>
<Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header onClick={clear} closeButton >
        <Modal.Title id="contained-modal-title-vcenter">
          Teach Video Call
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <JitsiMeeting
    domain = { "18.117.227.68:9011" }
    roomName = "videocall"
    configOverwrite = {{
      toolbarButtons:['microphone', 'hangup','settings','camera',],
      buttonsWithNotifyClick: [{key:'hangup',preventExecution: true},{key: 'chat',preventExecution: true},],
      hiddenPremeetingButtons: ['invite'],
      notifications: [],
        startWithAudioMuted: true,
        disableModeratorIndicator: true,
        startScreenSharing: true,
        enableEmailInStats: false,
        DEFAULT_LOGO_URL: "data:image/png;base64,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",
    }}
    interfaceConfigOverwrite = {{
        DISABLE_JOIN_LEAVE_NOTIFICATIONS: true
    }}
    userInfo = {{
        displayName: 'YOUR_USERNAME'
    }}
    onApiReady = { (externalApi) => {
        // here you can attach custom event listeners to the Jitsi Meet External API
        // you can also store it locally to execute commands
    } }
    getIFrameRef = { (iframeRef) => { iframeRef.style.height = '600px';iframeRef.style.width = '750px'; } }
/>
          {/* <button
            style={{
              position: "relative",
              top: "5%",
              // left: "80%",
            }}
            onClick={clear}
            >
            C-Call
          </button> */}

      </Modal.Body>
      <Modal.Footer>
        <Button onClick={clear}>Close</Button>
      </Modal.Footer>
    </Modal>



        </div>
      );
    };
    const clear = () => {
      ReactDOM.unmountComponentAtNode(videoNode);
      videoNode.remove();
    };
    ReactDOM.render(<PopupContent />, videoNode);
  }
  
// const uniqueString = require("uuid").uuid.v4();
  const voiceNode = document.createElement("div");
  async function voiceCall(event) {
    event.preventDefault();
    console.log("voiceCall");
    document.body.appendChild(voiceNode);
    voiceNode.style.height = "300px";
    voiceNode.style.width = "600px";
    voiceNode.style.position = "relative"
    const PopupContent = () => {
      ws.send(
        JSON.stringify({
          meta_attributes: "react",
          message_type: "message/videocall",
          media_link: "https://18.117.227.68:9011/voicecall",
          message_text: "",
        })
        );
        return (
          <div>

<JitsiMeeting
    domain = { "18.117.227.68:9011" }
    roomName = "voicecall"
    configOverwrite = {{
      toolbarButtons:['microphone', 'hangup','settings'],
      buttonsWithNotifyClick: [{key:'hangup',preventExecution: true},{key: 'chat',preventExecution: true},],
      hiddenPremeetingButtons: ['camera','invite','select-background'],
      notifications: [],
        startWithAudioMuted: true,
        disableModeratorIndicator: true,
        startScreenSharing: true,
        enableEmailInStats: false
    }}
    interfaceConfigOverwrite = {{
        DISABLE_JOIN_LEAVE_NOTIFICATIONS: true
    }}
    userInfo = {{
        displayName: 'YOUR_USERNAME'
    }}
    onApiReady = { (externalApi) => {

    } }
    getIFrameRef = { (iframeRef) => { iframeRef.style.height = '600px';iframeRef.style.width = '600px'; } }
/>
          <button
            style={{
              position: "absolute",
              top: "5%",
              // left: "80%",
            }}
            onClick={clear}
          >
            C-Call
          </button>
        </div>
      );
    };
    const clear = () => {
      ReactDOM.unmountComponentAtNode(voiceNode);
      voiceNode.remove();
    };
    ReactDOM.render(<PopupContent />, voiceNode);
  }







  useEffect(() => {
    console.log(
      `web socket connection created for ${userName},${receiverId}!!`
    );
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
        const responseData = JSON.stringify(res.data);
        const message = JSON.parse(responseData);
        setMessageCount(message.count);
        console.log( message.results);
        const prevMsgs = [];
        if (message?.results?.length)
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
              sender: receivedObj?.from_user.username || "NA",
              message: receivedObj?.message_text || "NA",
              time: time || "NA",
              date: date || "NA",
              profile: receivedObj?.user_profile?.image || Avatar,
              message_type: message_type || "message/text",
              media_link: receivedObj?.media_link || null,
            };
            prevMsgs.push(msgObj);
          }
        setMessages([...prevMsgs]);
      })
      .then(() => {
        setLoad(false);
      })
      .catch((error) => {
        console.log("error : ", error);
      });
  }, [userName]);

  function updateData(value) {
    axios
      .get(
        `${utils.getHost()}/chat/get/user/paginated_messages/?user=${receiverId}&records=10&p=${value}`,
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
            sender: receivedObj?.from_user.username || "NA",
            message: receivedObj?.message_text || "NA",
            time: time || "NA",
            date: date || "NA",
            profile: receivedObj?.user_profile?.image || null,
            message_type: message_type || "message/text",
            media_link: receivedObj?.media_link || null,
          };

          prevMsgs.push(msgObj);
        }
        setLoad(false);
        setMessages([...prevMsgs, ...messages]);
      })
      .finally(() => {
        setLoad(false);
      });
  }

  useEffect(() => {
    ws.onmessage = (evt) => {
      // listen to data sent from the websocket server
      const message = JSON.parse(JSON.stringify(evt.data));
      const receivedObj = JSON.parse(message);
      console.log("receivedObj  ",receivedObj);
      tempDict[receivedObj.from_user.id + receivedObj.from_user.username] =
        receivedObj.unread_message_count;
      props.receiveMessageCount({
        unreadMessageCountDict: tempDict,
        unreadMessageCount: receivedObj.unread_message_count,
        userUniqeId: receivedObj.from_user.id + receivedObj.from_user.username,
      });
      const type = receivedObj?.message_type;
      if(type === "message/videocall"){
        setCall(true)
        setVideoLink( receivedObj?.media_link)
      }else
      if (receiverId === receivedObj.from_user.id) {
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
          sender: receivedObj?.from_user.username || "NA",
          message: receivedObj?.message_text || "NA",
          time: time || "NA",
          date: date || "NA",
          profile: receivedObj?.user_profile.image || null,
          message_type: message_type || "message/text",
          media_link: receivedObj?.media_link || null,
        };
        const prevMsgs = [...messages];
        prevMsgs.push(msgObj);
        setMessages([...prevMsgs]);
      }
    };
  }, [messages]);

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

  const onStopRecording = async (recording) => {
    let formData = new FormData();
    formData.append("file", recording, "audio.mp3");
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
        let a = {
          sender: loggedUser.username,
          message: inputRef.current.value,
          time: timeNow,
          date: date,
          media_link: file_url ? file_url : null,
          message_type: "audio/mpeg",
          profile: getChatImage,
        };
        const prevMsgs = [...messages];
        prevMsgs.push(a);
        setMessages([...prevMsgs]);
        setIsSelected(false);
        setState({ file: false });
        document.getElementById("inp").value = "";
      })
      .catch((resp) => {
        // setState({ file: false });

        alert("connection is breaked");
      });
  };

  const node = document.createElement("div");

  const clear = () => {
    setOpen(false);
  };

 

  const RenderInWindow = (props) => {
    const [container, setContainer] = useState(null);
    const newWindow = useRef(window);
    useEffect(() => {
      const div = document.createElement("div");
      setContainer(div);
    }, []);

    useEffect(() => {
      if (container) {
        newWindow.current = window.open(
          "",
          "",
          "width=600,height=400,left=200,top=200"
        );
        newWindow.current.document.body.appendChild(container);
        const curWindow = newWindow.current;
        return () => curWindow.close();
      }
    }, [container]);

    return container && createPortal(props.children, container);
  };



  const [open, setOpen] = useState();
  return (
    <>
      {/* Page content */}
      <ChatHeader
        name={userName}
        props={props}
        type={type}
        image={getChatImage}
      />
      {open && (
        <div className="position-fixed  end-0">
          {/* <Button onClick={() => answer("https://18.117.227.68:9011")}>
            Answer
          </Button> */}
        </div>
      )}
      <div className="position-fixed  end-0">
      <CallIcon
         style={{
          color: "white",
          position: "absolute",
          right: "200",
          top: "15",
          fontSize: "40",
          cursor: "pointer",}}
          onClick={voiceCall}
          >
          
          </CallIcon> 

        <VideocamIcon
          style={{
            color: "white",
            position: "absolute",
            right: "100",
            top: "15",
            fontSize: "40",
            cursor: "pointer",
          }}
        onClick={videoCall}
        
        ></VideocamIcon>
      </div>
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
      {open && (
        <RenderInWindow>
          <div>
          <Modal
        style={{ height: "600px", width: "800px", textAlign: "center" }}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Meeting
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        
        <JitsiMeeting
              domain={"18.117.227.68:9011"}
              roomName="PleaseUseAGoodRoomName"
              configOverwrite={{
                toolbarButtons: [
                  "microphone",
                  "chat",
                  "fullscreen",
                  "hangup",
                  "settings",
                  "toggle-camera",
                ],
                buttonsWithNotifyClick: [
                  { key: "hangup", preventExecution: true },
                  { key: "chat", preventExecution: true },
                ],
                hiddenPremeetingButtons: ["camera"],
                startWithAudioMuted: true,
                disableModeratorIndicator: true,
                startScreenSharing: true,
                enableEmailInStats: false,
              }}
              interfaceConfigOverwrite={{
                DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
              }}
              userInfo={{
                displayName: "YOUR_USER",
              }}
              onApiReady={(externalApi) => {
                // here you can attach custom event listeners to the Jitsi Meet External API
                // you can also store it locally to execute commands
              }}
              getIFrameRef={(iframeRef) => {
                iframeRef.style.height = "400px";
              }}
            />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
          </div>
        </RenderInWindow>
      )}
                      <div >
                        {call && (
                        <Answer  type='message/videocall' image={videoLink} profile={null} sender={loggedUser.username}/>
                        )}
                      </div>
      {state.file ? (
        <div>
          <CancelSharpIcon
            style={{ flex: 1, marginLeft: "90%", position: "relative" }}
            onClick={() => {
              setState({
                file: null,
                filePreviewUrl: null,
              });
              setIsSelected(false);
            }}
            color="primary"
            fontSize="large"
          />
          <ImageShow filePreviewUrl={state.filePreviewUrl} />
        </div>
      ) : (
        <div
          className="content"
          id="scroll"
          ref={scrollBottom}
          onScroll={onScroll}
        >
          {messages.map((e, i) => {
            return (
              <div
                key={i}
                style={{
                  marginTop: "2%",
                  overflow: "auto",
                }}
              >
                {e.sender === loggedUser.username ? (
                  <div>
                    {e.media_link ? (
                      <ImageView
                        type={e.message_type}
                        image={e.media_link}
                        profile={profileSrc}
                        text={e.message}
                        sender={e.sender}
                        time={e.time}
                      />
                    )
                   :
                    (
                      <TextView
                        sender={"Me"}
                        profile={profileSrc}
                        text={e.message}
                        time={e.time}
                      />
                    )}
                  </div>
                ) : (
                  <div>
                    {e.media_link ? (
                      <ImageView
                        type={e.message_type}
                        image={e.media_link}
                        profile={e.profile}
                        text={`${e.message}`}
                        sender={e.sender}
                        time={e.time}
                        float={"left"}
                      />
                    ):(
                      <TextView
                        sender={e.sender}
                        profile={e.profile}
                        text={e.message}
                        time={e.time}
                        float={"left"}
                      />
                    )}

                  </div>
                )}
                
              </div>
            );
          })}
          <Outlet />
        </div>
      )}
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
    </>
  );
}

export default UserChat;
