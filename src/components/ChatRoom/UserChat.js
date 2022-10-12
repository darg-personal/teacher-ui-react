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
  const [callType, setCallType] = useState('');
const [videoLink, setVideoLink] = useState(null);

  const userName = props.userName;
  const receiverId = props.userId;
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
          media_link: "https://conference.dreampotential.org/videocall",
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
    domain = { "conference.dreampotential.org" }
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
          message_type: "message/voicecall",
          media_link: "https://conference.dreampotential.org/voicecall",
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
                  Teach Voice Call
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
              <JitsiMeeting
            domain = { "conference.dreampotential.org" }
            roomName = "voicecall"
            configOverwrite = {{
              toolbarButtons:['microphone', 'hangup','settings'],
              buttonsWithNotifyClick: [{key:'hangup',preventExecution: true},{key: 'chat',preventExecution: true},],
              hiddenPremeetingButtons: ['camera','invite','select-background'],
              notifications: [],
                startWithAudioMuted: true,
                disableModeratorIndicator: true,
                startScreenSharing: true,
                enableEmailInStats: false,
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
              </Modal.Body>
              <Modal.Footer>
                <Button variant="danger" onClick={clear}>Leave</Button>
              </Modal.Footer>
            </Modal>          
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
      console.log("*******receivedObj From Onmessage******** ",receivedObj);
      tempDict[receivedObj.from_user.id + receivedObj.from_user.username] =
      receivedObj.unread_message_count;
      props.receiveMessageCount({
        unreadMessageCountDict: tempDict,
        unreadMessageCount: receivedObj.unread_message_count,
        userUniqeId: receivedObj.from_user.id + receivedObj.from_user.username,
      });
      const type = receivedObj?.message_type;
      if(type === "message/videocall" || type === "message/voicecall"){
        console.log('------video call ---------');
        setCallType(type)
        setCall(true)
        setVideoLink( receivedObj?.media_link)
      }
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
              domain={"conference.dreampotential.org"}
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
          <Button variant="danger" onClick={props.onHide}>Leave</Button>
        </Modal.Footer>
      </Modal>
          </div>
        </RenderInWindow>
      )}
                      <div >
                        {call && (
                          callType === 'message/videocall'?
                          <Answer  type='message/videocall' image={videoLink} profile={null} sender={loggedUser.username}/>
                          :
                          <Answer  type='message/voicecall' image={videoLink} profile={null} sender={loggedUser.username}/>
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
