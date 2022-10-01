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
} from "./templates/MainChat/Chat";
import CancelSharpIcon from "@mui/icons-material/CancelSharp";
import Record from "./Recorder";
import { JitsiMeeting } from "@jitsi/react-sdk";
import { createPortal } from "react-dom";

function UserChat(props) {
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
  const userName = props.userName;
  const receiverId = props.userId;
  const type = props.type;
  const getChatImage = props.getChatImage;
  const [selectedFile, setSelectedFile] = useState();
  const [isSelected, setIsSelected] = useState(false);
  const [state, setState] = useState({
    file: "",
    filePreviewUrl:
      "https://github.com/OlgaKoplik/CodePen/blob/master/profile.jpg?raw=true",
  });

  const [receiveMessageCountDict, setReceiveMessageCountDict] = useState({});
  const receiveMessageCountDictProp = props.receiveMessageCountDict;
  var ws = props.websocket;
  var tempDict = {};
  const recieveMessages = (userId, username) => {
    console.log("recievemessages function is callled from userChat");
    const userUniqeId = userId + username;
    console.log(tempDict, "receiveMessageCountDict");
    var recCount = 1;
    console.log(tempDict[userUniqeId], "receiveMessageCountDict[userUniqeId]");
    if (tempDict[userUniqeId]) {
      recCount = tempDict[userUniqeId] + 1;
      console.log("uniq id found");
    } else {
      console.log("uniqe id not found");
      recCount = 1;
    }
    console.log(receiveMessageCountDictProp, "receiveMessageCountDictProp");
    var countDict = {};
    if (receiveMessageCountDictProp) {
      // countDict = receiveMessageCountDictProp;
      countDict = receiveMessageCountDictProp;
    }
    countDict[userUniqeId] = recCount;
    console.log(countDict, "countDict......----");
    tempDict = countDict;
    // setReceiveMessageCountDict(countDict);
    // console.log(receiveMessageCount,'receiveMessageCount');
    console.log(tempDict, "setReceiveMessageCountDict");
    props.receiveMessageCount({
      receiveMessageCountDict: countDict,
      userUniqeId,
    });
  };

  useEffect(() => {
    if (scrollBottom) {
      scrollBottom.current.addEventListener("DOMNodeInserted", (event) => {
        const { currentTarget: target } = event;
        target.scroll({ top: target.scrollHeight, behavior: "smooth" });
      });
    }
  }, []);

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

  useEffect(() => {
    console.log(
      `web socket connection created for ${userName},${receiverId}!!`
    );
    fetchData();
  }, [userName, receiverId]);

  async function fetchData() {
    await axios
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
  }
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
      recieveMessages(
        // receiveMessageCountDict,
        // receivedObj?.to_user.id,
        // receivedObj?.to_user.username
        receivedObj?.from_user.id,
        receivedObj?.from_user.username
      );
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
        console.log(resp.data.content_type);

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
  // async function handleClickCall(event) {
  //   event.preventDefault();
  //   console.log("hello");
  //   document.body.appendChild(node);
  //   node.style.height = "300px";
  //   node.style.width = "600px";
  //   node.style.position = "relative";
  //   const PopupContent = () => {
  //     ws.send(
  //       JSON.stringify({
  //         meta_attributes: "react",
  //         message_type: "message/videocall",
  //         media_link: "https://192.168.29.147:8443/nayanroom",
  //         message_text: "https://192.168.29.147:8443/nayanroom",
  //       })
  //     );
  //     return (
  //       <div>
  //         <JitsiMeeting
  //           domain={"192.168.29.147:8443"}
  //           roomName="PleaseUseAGoodRoomName"
  //           configOverwrite={{
  //             startWithAudioMuted: true,
  //             disableModeratorIndicator: true,
  //             startScreenSharing: true,
  //             enableEmailInStats: false,
  //           }}
  //           interfaceConfigOverwrite={{
  //             DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
  //           }}
  //           userInfo={{
  //             displayName: "YOUR_USER",
  //           }}
  //           onApiReady={(externalApi) => {
  //             // here you can attach custom event listeners to the Jitsi Meet External API
  //             // you can also store it locally to execute commands
  //           }}
  //           getIFrameRef={(iframeRef) => {
  //             iframeRef.style.height = "400px";
  //           }}
  //         />
  //         <button
  //           style={{
  //             position: "absolute",
  //             top: "5%",
  //             // left: "80%",
  //           }}
  //           onClick={clear}
  //         >
  //           C-Call
  //         </button>
  //       </div>
  //     );
  //   };
  //   const clear = () => {
  //     ReactDOM.unmountComponentAtNode(node);
  //     node.remove();
  //   };
  //   ReactDOM.render(<PopupContent />, node);
  // }

  const clear = () => {
    // ReactDOM.unmountComponentAtNode(node);
    // node.remove();
    setOpen(false)
  };

  function handelclickpopupcall(event) {
    event.preventDefault();
    setOpen(true)
      ws.send(
        JSON.stringify({
          meta_attributes: "react",
          message_type: "message/videocall",
          media_link: `https://18.117.227.68:9011/${userName}`,
          message_text: null,
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
        time: timeNow,
        date: date,
        meta_attributes: "react",
        message_type: "message/videocall",
        media_link: `https://18.117.227.68:9011/${userName}`,
        message_text: null,
        profile: getChatImage,
      };
      const prevMsgs = [...messages];
      prevMsgs.push(a);
      setMessages([...prevMsgs]);
  }

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

  function answer(data) {
    console.log({ data });
    function popupWindow(url, windowName, win, w, h, username) {
        const y = win.top.outerHeight / 2 + win.top.screenY - (h / 2);
        const x = win.top.outerWidth / 2 + win.top.screenX - (w / 2);
        return win.open(url, windowName, `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${w}, height=${h}, top=${y}, left=${x}`);
    }
    popupWindow(data, 'test', window, 800, 600);
}


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
            <Button onClick={() => answer('https://18.117.227.68:9011')}>Answer</Button>
        </div>
    )}
      <div className="position-fixed  end-0">
        <VideocamIcon
          style={{
            color: "white",
            position: "absolute",
            right: "100",
            top: "15",
            fontSize: "40",
            cursor: "pointer",
          }}
          // onClick={() => setOpen(true)}
          onClick={handelclickpopupcall}
          // onClick={handleClickCall}
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
      {
        open && (
        <RenderInWindow>
          <div>
            <JitsiMeeting
              domain={"192.168.29.147:8443"}
              roomName="PleaseUseAGoodRoomName"
              configOverwrite={{
                toolbarButtons:['microphone','chat','fullscreen', 'hangup','settings','toggle-camera'],
                buttonsWithNotifyClick: [{key:'hangup',preventExecution: true},{key: 'chat',preventExecution: true},],
                hiddenPremeetingButtons: ['camera'],
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
        </RenderInWindow>
      )}

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
                      <ImageView
                        type={e.message_type}
                        image={e.media_link}
                        profile={e.profile}
                        text={`${e.message}`}
                        sender={e.sender}
                        time={e.time}
                        float={"left"}
                      />
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
