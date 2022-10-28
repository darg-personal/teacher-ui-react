import React, { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import utils from "../../pages/auth/utils";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import { Badge } from "@mui/material";
import { DisplaySearchUser } from "../Axios/ChatPannel/ChatPannel";
import { FaSearch } from "react-icons/fa";
import { ImArrowLeft2 } from "react-icons/im";
import "./contact.css";
import { Dropdown } from "react-bootstrap";
import { BiDotsVerticalRounded } from "react-icons/bi";

let Token = localStorage.getItem("token");
let login_user = JSON.parse(localStorage.getItem("user"));
let login_userImage = localStorage.getItem("loginUserImage");
function Contact(props) {
  const [group, setGroup] = useState([]);
  const [isActive, setIsActive] = useState();
  const [page, setPage] = useState(0);
  const [allUser, setAllUser] = useState(false);
  const [searchGroup, setSearchGroup] = useState([]);
  const [inputSearch, setInputSearch] = useState('');
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
  }, [unreadMessageCountDictForGroup, unreadMessageCountDictForGroup[login_user.id]]);

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
                isConnected: 0,
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
    console.log(value, 'value from handleclick');
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

  function getChat(targetValue) {
    console.log(targetValue.length);
    if (targetValue.length > 0) {
      const val = DisplaySearchUser(targetValue);
      val.then((resp) => {
        setSearchGroup([...resp])
      })
      return true;
    }
    return false
  }

  const DisplaySearch = () => {
    return (<>
      {searchGroup && searchGroup.map((e, i) => (
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
    </>
    )
  }

  return (
    <div className="sidebar">
      <div style={{
        padding: '10px 16px',
        backgroundColor: '#b9b4b4',
        fontSize: '18px', display: 'flex', justifyContent: 'space-between'
      }}>
        <ListItemAvatar>
          <Avatar alt={`xyz`} src={login_userImage} />
        </ListItemAvatar>
        <Dropdown>
          <Dropdown.Toggle variant="white" id="dropdown-basic" style={{ border: 'none', color: 'transparent' }}>
            <BiDotsVerticalRounded
              id="dropdown-basic"
              style={{ color: "#FFF", marginTop: '5px' }}
              fontSize='25px'
            ></BiDotsVerticalRounded>
          </Dropdown.Toggle>

          <Dropdown.Menu className="drop">
            <Dropdown.Item>Settings</Dropdown.Item>
            <Dropdown.Item>Details</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <div style={{
        marginLeft: '2px',
        backgroundColor: '#e2dfdf',
        fontSize: '15px',
        padding: '0px 3px',
        alignItems: 'center',
        borderRadius: '20px', borderWidth: 1,
      }}>
        {inputSearch.length == 0 ?
          <FaSearch /> : <ImArrowLeft2 onClick={() => setInputSearch('')} />
        }
        <input onChange={e => {
          setInputSearch(e.target.value)
          getChat(e.target.value)
        }}
          value={inputSearch}
          type="text" placeholder='Search User ...'
          style={{ border: 'none', width: '80%', borderRadius: '20px', outline: 'none', backgroundColor: '#e2dfdf' }}
        />
      </div>
      <hr style={{ width: '100%' }} />

      {inputSearch.length > 0 && DisplaySearch()}
      {
        inputSearch.length == 0 && <>
          {group.map((e, i) => (
            <div key={e.id + e.name} >
              <div
                className={e.name === isActive ? "link active" : "link"}
                onClick={() => handleClick(e)}
              >
                <ListItemAvatar>
                  <Avatar alt={e.name} src={e.image} style={{ height: '50px', width: '50px' }} />
                </ListItemAvatar>
                <>
                  <ListItemText primary={e.name} secondary="last seen 09:00" />
                </>
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
              <hr style={{ marginTop: '1px', marginBottom: '1px', width: '80%', marginLeft: '20%' }} />
            </div>
          ))}
          {allUser &&
            <p className="d-flex justify-content-center button-upload-org" style={{ color: 'blue' }} onClick={() => {
              getGroupData(page);
            }}>show more</p>
          }
        </>
      }
    </div>
  );
}

export default Contact;
