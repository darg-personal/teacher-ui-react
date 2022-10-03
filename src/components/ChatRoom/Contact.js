import React, { useState } from "react";
import "./contact.css";
import axios from "axios";
import { useEffect } from "react";
import utils from "../../pages/auth/utils";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import { Badge } from "@mui/material";

let Token = localStorage.getItem("token");
let login_user = JSON.parse(localStorage.getItem("user"));
function Contact(props) {
  const [group, setGroup] = useState([]);
  const [isActive, setIsActive] = useState();
  const activeUser = props.activeUser;

  // const [notificationCountForClass, setNotificationCountForClass] = useState({});
  const [notificationCountForUser, setNotificationCountForUser] = useState({});
  const [wsState, setWsState] = useState({});
  const [tempState, setTempState] = useState(null);

  const unreadMessageCountDict = props.unreadMessageCountDict;
  const userUniqeId = props.userUniqeId;
  // const unreadMessageCount = props.unreadMessageCount;
  // const chatroomId = props.chatroomUniqeId;

  // useEffect(() => {
  //   setNotificationCountForClass({
  //     ...notificationCountForClass,
  //     [chatroomId]: receiveMessageCountDict[chatroomId],
  //   });
  // }, [chatroomId, receiveMessageCountDict[chatroomId]]);

  useEffect(() => {
    setNotificationCountForUser({
      ...notificationCountForUser,
      [userUniqeId]: unreadMessageCountDict[userUniqeId],
    });
  }, [userUniqeId, unreadMessageCountDict[userUniqeId]]);


  useEffect(() => {
    setIsActive(activeUser.chatRoom)
  }, [activeUser])

  useEffect(() => {
    getGroupData();
  }, [activeUser]);
  
  // const connect = (cRoom, userId, type, isConnected) => {
  //   console.log(`Connnnect calll for ${cRoom}`);
  //   setTempState(null);
  //   const ws = [];
  //   if (type == "Channel")
  //       ws.push(
  //           new WebSocket(
  //               `${utils.getWebsocketHost()}/msg/channel/?token=${Token}&roomname=${cRoom}`
  //           )
  //       );
  //   else
  //       ws.push(
  //           new WebSocket(
  //               `${utils.getWebsocketHost()}/msg/user/?token=${Token}&receiver_id=${userId}`
  //           )
  //       );
  //   const getSocket = ws[0];
  //   getSocket.onopen = () => {
  //       var chatroom = cRoom;
  //       var wsdict = wsState;
  //       wsdict[chatroom] = getSocket;
  //       setTempState(getSocket);
  //       setWsState(wsdict)
  //     };
  //   };
  //   console.log(wsState,'wsState.................>>>>>!');

useEffect(() => {
  getGroupData();
}, []);
const getGroupData = () => {
  axios
  .get(`${utils.getHost()}/chat/get/user_connected_list/`, {
    headers: {
      Authorization: `Bearer ${Token}`,
    },
  })
  .then((response) => {
    const groups = response.data;
    const prevGroup = [];
    const temp = groups.results.length;
    for (let i = 0; i < temp; i++) {
      if (groups.results[i].type === "Channel") {
        const receivedObj = groups?.results[i].Channel;
        // connect(receivedObj?.name,receivedObj?.id,'Channel')
            prevGroup.push({
              // id: i,
              id: receivedObj?.id,
              name: receivedObj?.name,
              created_at: receivedObj?.created_at,
              typeId: receivedObj?.id,
              image: receivedObj?.image || Avatar,
              type: "Channel",
              isConnected: groups?.results[i].designation,
              about: receivedObj?.about
            });
          }
          else {
            const receivedObj = groups?.results[i]?.user;
            // connect(receivedObj?.username,receivedObj?.id,'user')
            if (login_user?.username !== receivedObj?.username) {
              prevGroup.push({
                // id: i,
                id: receivedObj?.id,
                name: receivedObj?.username,
                created_at: receivedObj?.created_at,
                typeId: receivedObj?.id,
                image: groups.results[i].user_profile.image || Avatar,
                type: "user",
                isConnected: 1,
                about: groups.results[i]?.user_profile?.about
              });
            }
          }
        }
        setGroup(
          prevGroup.sort(function (a, b) {
            return a.created_at > b.created_at ? -1 : 1;
          })
        );
      })
      .catch((error) => {
        console.log("Not Able to fetch Groups ", error);
      });
  };

  const handleClick = (value) => {
    setIsActive(value.name);
    if(value.id + value.name == userUniqeId){
    setNotificationCountForUser({
      [userUniqeId]: 0,
    });
  }
    // setNotificationCountForClass({
    //   [chatroomId]: 0,
    // });
    console.log(value,'value............>!');
    props.type({
      name: value.name, type: value.type, id: value.id, image: value.image,
      isConnected: value.isConnected,about: value.about
    });
  };

  return (
    <>
      <div className="sidebar">
        {group.map((e, i) => (
          <div
            key={e.id + e.name}
            className={e.name === isActive ? "link active" : "link"}
            onClick={() => handleClick(e)}
          >
            <ListItemAvatar>
              <Avatar alt={e.name} src={e.image} />
            </ListItemAvatar>
            <ListItemText primary={e.name} secondary="last seen 08:00" />
            {
              e.name !== isActive ? (
                e.type === "Channel" ? (
                  <Badge
                    badgeContent={2}
                    // badgeContent={notificationCountForClass[e.id + e.name] || 0}
                    color="success"
                  ></Badge>
                ) : (
                  <Badge
                    // badgeContent={5}
                    badgeContent={notificationCountForUser[e.id + e.name] || 0}
                    color="success"
                  ></Badge>
                )
              ) : null
            }

          </div>

        ))}
      </div>
    </  >
  );
}

export default Contact;
