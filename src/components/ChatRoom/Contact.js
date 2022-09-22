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

  const [notificationCountForClass, setNotificationCountForClass] = useState({});
  const [notificationCountForUser, setNotificationCountForUser] = useState({});
  
  const receiveMessageCountDict = props.receiveMessageCountDict;
  const userUniqeId = props.userUniqeId;
  const chatroomId = props.chatroomUniqeId;

  useEffect(() => {
    console.log(props, "props......");
    setNotificationCountForClass({
      ...notificationCountForClass,
      [chatroomId]: receiveMessageCountDict[chatroomId],
    });
  }, [chatroomId, receiveMessageCountDict[chatroomId]]);

  useEffect(() => {
    console.log(props, "props......");
    setNotificationCountForUser({
      ...notificationCountForUser,
      [userUniqeId]: receiveMessageCountDict[userUniqeId],
    });
  }, [userUniqeId, receiveMessageCountDict[userUniqeId]]);


  useEffect(() => {
    setIsActive(activeUser.chatRoom)
  }, [activeUser])

  useEffect(() => {
    getGroupData();
  }, [activeUser]);

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
            const receivedObj = groups.results[i].Channel;
            prevGroup.push({
              id: i,
              name: receivedObj.name,
              created_at: receivedObj.created_at,
              typeId: receivedObj.id,
              image: receivedObj.image || Avatar,
              type: "Channel",
              isConnected: groups.results[i].designation
            });
          }
          else {
            const receivedObj = groups.results[i].user;
            if (login_user.username !== receivedObj.username) {
              prevGroup.push({
                id: i,
                name: receivedObj.username,
                created_at: receivedObj.created_at,
                typeId: receivedObj.id,
                image: groups.results[i].user_profile.image || Avatar,
                type: "user",
                isConnected: 1
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
    props.type({
      name: value.name, type: value.type, id: value.typeId, image: value.image,
      isConnected: value.isConnected
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
                  badgeContent={notificationCountForClass[e.id + e.name] || 0}
                  color="success"
                ></Badge>
              ) : (
                <Badge
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
