import React, { useState } from "react";
import "./contact.css";
import axios from "axios";
import { useEffect } from "react";
// import MainChat from "./MainChat";
import utils from "../../pages/auth/utils";
import Avatar from '../../assets/Images/avatar.svg'

let Token = localStorage.getItem("token");
let login_user = JSON.parse(localStorage.getItem("user"));
function Contact(props) {
  const [group, setGroup] = useState([]);
  const [isActive, setIsActive] = useState();

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
            const receivedObj = groups.results[i].Channel;
            prevGroup.push({
              id: i,
              name: receivedObj.name,
              created_at: receivedObj.created_at,
              typeId: receivedObj.id,
              // image: Avatar,
              type: "Channel",
            });
          } else {
            const receivedObj = groups.results[i].user;
            if (login_user.username != receivedObj.username){
            prevGroup.push({
              id: i,
              name: receivedObj.username,
              created_at: receivedObj.created_at,
              typeId: receivedObj.id,
              // image: groups.results[i].user_profile.image || Avatar, 
              type: "user",
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
        console.log("Not Able to fetch Groups ",error);
      });
  };

  const handleClick = (value) => {
    console.log(value,'.......value');
    setIsActive(value.name);
    props.type({ name: value.name, type: value.type, id: value.typeId });
  };

  return (
    <>
      <div className="sidebar">
        {group.map((e, i) => (
          <div
            key={i}
            className={e.name === isActive ? "link active" : "link"}
            onClick={() => handleClick(e)}
          >
            <img
              // src={e.image}
              src={e.image ? e.image : Avatar }
              alt="Avatar"
              className="avatar"
            />
            {e.name}
          </div>
        ))}
      </div>
    </>
  );
}

export default Contact;
