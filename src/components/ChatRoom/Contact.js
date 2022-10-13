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
  const [page, setPage] = useState(0);
  const [allUser, setAllUser] = useState(true);
  const activeUser = props.activeUser;

  const [notificationCountForClass, setNotificationCountForClass] = useState({});
  const [notificationCountForUser, setNotificationCountForUser] = useState({});

  const unreadMessageCountDict = props.unreadMessageCountDict;
  const unreadMessageCountDictForGroup = props.unreadMessageCountDictForGroup;

  const userUniqeId = props.userUniqeId;
  const channelId = props.channelId;
  const channelName = props.channelName;

  useEffect(() => {
    setNotificationCountForClass({
      ...notificationCountForClass,
      [channelId]: unreadMessageCountDictForGroup[login_user.id],
    });
  }, [unreadMessageCountDictForGroup,unreadMessageCountDictForGroup[login_user.id]]);
    
    useEffect(() => {
      setNotificationCountForUser({
        ...notificationCountForUser,
        [userUniqeId]: unreadMessageCountDict[userUniqeId],
      });
    }, [unreadMessageCountDict, unreadMessageCountDict[userUniqeId]]);
    

  useEffect(() => {
    setIsActive(activeUser.chatRoom);
  }, [activeUser]);

  useEffect(() => {
    getGroupData(0);
  }, []);
  const getGroupData = (value) => {
    let page = value + 1
    axios
      .get(`${utils.getHost()}/chat/get/user_connected_list/?p=${page}`, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      })
      .then((response) => {
        const groups = response.data;
        const prevGroup = [...group];
        const temp = groups.results.length;
        for (let i = 0; i < temp; i++) {
          if (groups.results[i].type === "Channel") {
            const receivedObj = groups?.results[i].Channel;
            prevGroup.push({
              // id: i,
              id: receivedObj?.id,
              name: receivedObj?.name,
              created_at: receivedObj?.created_at,
              typeId: receivedObj?.id,
              image: receivedObj?.image || Avatar,
              type: "Channel",
              isConnected: groups?.results[i].designation,
              about: receivedObj?.about,
            });
          } else {
            const receivedObj = groups?.results[i]?.user;
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
                about: groups.results[i]?.user_profile?.about,
              });
            }
          }
        }
        setGroup([...prevGroup])
        setGroup(
          prevGroup.sort(function (a, b) {
            return a.created_at > b.created_at ? -1 : 1;
          })
        );
        if (response.data.count > page * 20) {
          setPage(page)
        }
        else
          setAllUser(false)

      }).then(() => {
      })
      .catch((error) => {
        console.log("Not Able to fetch Groups ", error);
      });
  };

  const handleClick = (value) => {
    console.log(value,'value from handleclick');
    setIsActive(value.name);
    if (value.id + value.name == userUniqeId) {
      setNotificationCountForUser({
        [userUniqeId]: 0,
      });
    }
    if (value.id + value.name == channelId + channelName) {
    setNotificationCountForClass({
      [channelId]: 0,
    });
    }

    props.type({
      name: value.name,
      type: value.type,
      id: value.id,
      image: value.image,
      isConnected: value.isConnected,
      about: value.about,
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
            {e.name !== isActive ? (
              e.type === "Channel" ? (
                <Badge
                  badgeContent={notificationCountForClass[e.id] || 0}
                  color="success"
                ></Badge>
              ) : (
                <Badge
                  badgeContent={notificationCountForUser[e.id + e.name] || 0}
                  color="success"
                ></Badge>
              )
            ) : null}
          </div>
        ))}
        {allUser &&
        <p className="d-flex justify-content-center button-upload-org" style={{ color: 'blue' }} onClick={() => {
          getGroupData(page);
        }}>show more</p>
      }
      </div>
    </>
  );
}

export default Contact;
