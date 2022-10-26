import React, { createRef, useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { Outlet } from "react-router-dom";
import "./mainChat.css";
import axios from "axios";
import utils from "../../pages/auth/utils";
import Loader from "./Loader";
import { useNavigate } from "react-router-dom";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { Dropdown } from "react-bootstrap";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import CancelSharpIcon from "@mui/icons-material/CancelSharp";
import VideocamIcon from "@mui/icons-material/Videocam";
import {
  ImageShow,
  ImageView,
  ImgUpload,
  TextView,
  Answer,
  notify,
  ChatHeader,
} from "./templates/MainChat/Chat";
import Record from "./Recorder";
import ReactDOM from "react-dom";
import { JitsiMeeting } from "@jitsi/react-sdk";
import CallIcon from "@mui/icons-material/Call";
import Modal from "react-bootstrap/Modal";
import { Button } from "react-bootstrap";
import Tooltip from '@mui/material/Tooltip';
import MicIcon from '@mui/icons-material/Mic';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
function MainChat(props) {
  let Token = localStorage.getItem("token");
  let navigate = useNavigate();
  let loggedUser = JSON.parse(localStorage.getItem("user"));
  const profileSrc = localStorage.getItem("loginUserImage");

  // Variables
  const inputRef = useRef(null);
  const scrollBottom = useRef(null);
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [messageCount, setMessageCount] = useState(0);
  const [load, setLoad] = useState(false);
  const [selectedFile, setSelectedFile] = useState();
  const [isSelected, setIsSelected] = useState(false);
  const [state, setState] = useState({
    file: "",
    filePreviewUrl: null,
  });
  const [call, setCall] = useState(false);
  const [callType, setCallType] = useState('');
  const [videoLink, setVideoLink] = useState(null);
  const [sendVoiceNote, setSendVoiceNote] = useState(true);

  // Props
  const chatroom = props.chatRoom;
  const ws = props.websocket;
  const chatroomId = props.chatRoomId;
  const type = props.type;
  const getChatImage = props.getChatImage;
  const [isConnected, setIsConnected] = useState(props.isConnected);

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
      })
      .finally(() => {
        setLoad(false);
      });
  }, [chatroom, chatroomId]);

  useEffect(() => {
    ws.onmessage = (evt) => {
      const message = JSON.parse(JSON.stringify(evt.data));
      const receivedObj = JSON.parse(message);
      console.log(receivedObj, "=========on message receivedObj========");
      props.receiveMessageCountForGroup({
        unreadMessageCountDictForGroup: receivedObj?.unead_message_count_dict,
        channelId: receivedObj?.channel.id,
        channelName: receivedObj?.channel.name,
      });

      const type = receivedObj?.message_type;
      if (loggedUser.id !== receivedObj?.user.id) {
        notify(receivedObj?.channel.name, type, receivedObj.message_text);
        // notify();
      }
      if ((type === "message/videocall" || type === "message/voicecall") && receivedObj?.user.username !== loggedUser.username) {
        setCall(true);
        setCallType(type)
        setVideoLink(receivedObj?.media_link);
      }
      console.log(chatroomId, '---chatroomId---', receivedObj.channel.id);
      if (chatroomId == receivedObj.channel.id && isConnected == 0) {
        const receivedDate = receivedObj?.created_at || "NA";
        const messageDate = new Date(receivedDate);
        const message_type = receivedObj?.message_type;
        const message = receivedObj?.message_text;
        if (message_type.includes("info")) {
          if (message.includes("remove")) setIsConnected(4);
        }
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
          message: message || "NA",
          time: time || "NA",
          date: date || "NA",
          profile: receivedObj?.user_profile.image || Avatar,
          message_type: message_type || "message/text",
          media_link: receivedObj?.media_link || null,
        };
        const prevMsgs = [...messages];
        prevMsgs.push(msgObj);

        // setIsConnected()
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
            show={true}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            fullscreen={true}
            dialogClassName="modal-90w"
          >
            <Modal.Header className="bg-primary" onClick={videoclear} closeButton >
              <Modal.Title className="text-white" id="contained-modal-title-vcenter">
                Teach Video Call
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <JitsiMeeting
                domain={"conference.dreampotential.org"}
                roomName="videocall"
                configOverwrite={{
                  toolbarButtons: ['microphone', 'hangup', 'settings', 'camera',],
                  buttonsWithNotifyClick: [{ key: 'hangup', preventExecution: true }, { key: 'chat', preventExecution: true },],
                  hiddenPremeetingButtons: ['invite'],
                  notifications: [],
                  startWithAudioMuted: true,
                  disableModeratorIndicator: true,
                  startScreenSharing: true,
                  enableEmailInStats: false,
                }}
                interfaceConfigOverwrite={{
                  DISABLE_JOIN_LEAVE_NOTIFICATIONS: true
                }}
                userInfo={{
                  displayName: 'YOUR_USERNAME'
                }}
                onApiReady={(externalApi) => {
                }}
                getIFrameRef={(iframeRef) => { iframeRef.style.height = '440px'; iframeRef.style.width = '1340px'; }}
              />
            </Modal.Body>
            <Modal.Footer>
              <Tooltip title="Leave the meeting"><Button variant="danger" onClick={videoclear}>End Call</Button></Tooltip>
            </Modal.Footer>
          </Modal>
        </div>
      );
    };
    const videoclear = () => {
      ReactDOM.unmountComponentAtNode(videoNode);
      videoNode.remove();
    };
    ReactDOM.render(<PopupContent />, videoNode);
  }

  const voiceNode = document.createElement("div");
  function voiceCall(event) {
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
            show={true}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            fullscreen={true}
            dialogClassName="modal-90w"
          >
            <Modal.Header onClick={voiceclear} closeButton >
              <Modal.Title id="contained-modal-title-vcenter">
                Teach Voice Call
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <JitsiMeeting
                domain={"conference.dreampotential.org"}
                roomName="voicecall"
                configOverwrite={{
                  toolbarButtons: ['microphone', 'hangup', 'settings'],
                  buttonsWithNotifyClick: [{ key: 'hangup', preventExecution: true }, { key: 'chat', preventExecution: true },],
                  hiddenPremeetingButtons: ['camera', 'invite', 'select-background'],
                  notifications: [],
                  startWithAudioMuted: true,
                  disableModeratorIndicator: true,
                  startScreenSharing: true,
                  enableEmailInStats: false,
                }}
                interfaceConfigOverwrite={{
                  DISABLE_JOIN_LEAVE_NOTIFICATIONS: true
                }}
                userInfo={{
                  displayName: 'YOUR_USERNAME'
                }}
                onApiReady={(externalApi) => {
                }}
                getIFrameRef={(iframeRef) => { iframeRef.style.height = '440px'; iframeRef.style.width = '1340px'; }}
              />
            </Modal.Body>
            <Modal.Footer>
              <Tooltip title="Leave the meeting"><Button variant="danger" onClick={() => { voiceclear(voiceclear) }}>End Call</Button></Tooltip>
            </Modal.Footer>
          </Modal>
        </div>
      );
    };
    const voiceclear = () => {
      ReactDOM.unmountComponentAtNode(voiceNode);
      voiceNode.remove();

    };
    ReactDOM.render(<PopupContent />, voiceNode);
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
      })
      .finally(() => {
        setLoad(false);
      });
  }

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

  useEffect(() => {
    if (scrollBottom) {
      scrollBottom.current.addEventListener("DOMNodeInserted", (event) => {
        const { currentTarget: target } = event;
        target.scroll({ top: target.scrollHeight, behavior: "smooth" });
      });
    }
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

        setState({ file: false });
        document.getElementById("inp").value = "";
      })
      .catch((resp) => {
        // setState({ file: false });

        alert("connection is breaked");
      });
  };

  return (
    <div className="groupChat">
      <ChatHeader
        name={chatroom}
        props={props}
        type={type}
        image={getChatImage}
        ws={ws}
        onclickVoice={(e) => voiceCall(e)}
        onclickVedio={(e) => videoCall(e)}
        chatroomId = {chatroomId}
      />
      {load ? <Loader /> : null}
      <div >
        {call && (
          callType === 'message/videocall' ?
            <Answer type='message/videocall' image={videoLink} profile={null} sender={loggedUser.username} ws={ws} />
            :
            <Answer type='message/voicecall' image={videoLink} profile={null} sender={loggedUser.username} ws={ws} />
        )}
      </div>
      {state.file ? (
        <>
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
          <ImageShow className="image-show-view" filePreviewUrl={state.filePreviewUrl} />
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
              <div
                key={e?.sender + i}
                style={{
                  marginTop: "2%",
                  overflow: "auto",
                }}
              >
                {e.message_type === "group-info-update" ? (
                  <div id="center">
                    <div className=" user-add-remove">
                      <p>{`${e.message}`}</p>
                    </div>
                  </div>
                ) : (
                  <div>
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
                        ) : (
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
                          (
                            <ImageView
                              type={e.message_type}
                              image={e.media_link}
                              profile={e.profile}
                              text={`${e.message}`}
                              sender={e.sender}
                              time={e.time}
                              float={"left"}
                            />
                          )
                        ) : (
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
                )}
                {/* <hr/> */}
              </div>
            );
          })}

          <Outlet />
        </div>
      )}

      <div className="box">
        <input
          ref={inputRef}
          className="input_text"
          id="inp"
          type="text"
          placeholder="Enter Text Here..."
          onKeyDown={(e) => e.key === "Enter" || handleClick}
          onChange={(value) => value.target.value.length > 0 ? setSendVoiceNote(false) : setSendVoiceNote(true)}
        />
        <ImgUpload onChange={photoUpload} />
        {!sendVoiceNote ?
          <button onClick={handleClick} className="btn btn-outline-primry" style={{ width: '80px', border: 'none', borderRadius: '500px', color: 'dodgerblue' }}>
            <SendRoundedIcon style={{ cursor: 'pointer' }} sx={{ fontSize: 40 }} ></SendRoundedIcon>
          </button>
          :
          <Tooltip title="Record a message"><MicIcon style={{ cursor: 'pointer', color: 'green' }} sx={{ fontSize: 40 }}><Record onStopRecording={onStopRecording}></Record></MicIcon></Tooltip>
        }
      </div>
    </div>
  );
}

export default MainChat;
