import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./contact.css";
import axios from "axios";
import { useEffect } from "react";
import utils from "../../pages/auth/utils";
let Token = localStorage.getItem("token");
function Contact() {
  const [group, setGroup] = useState([]);

  useEffect(() => {
    // axios.get('http://192.168.1.37:9000/s3_uploader/listgroup/')
    // axios
    //   .get(`${utils.getHost()}/s3_uploader/listgroup/`, {
    //     headers: {
    //       Authorization: `Bearer ${Token}`,
    //     },
    //   })
    //   .then((response) => {
    //     const groups = response.data;
    //     const prevGroup = [];
    //     console.log(groups, "--");
    //     for (let i = 0; i <= groups.length; i++) {
    //       const receivedObj = groups[i].Channel;
    //       console.log(receivedObj);
    //       prevGroup.push(receivedObj);
    //     }
    //     setGroup(prevGroup);
    //     // console.log(',,,,,,,,,,,,,,,,,,,,,,,',group);
    //   })
    //   .catch((error) => {
    //     console.log(" Not able to fetch groups ");
    //   });
    getGroupData();
  }, []);
  console.log("------------------------------------", group);


  const getGroupData = () => {
    axios.get(`${utils.getHost()}/chat/get/userConnectedList/`,
      {
        headers: {
          Authorization:
            `Bearer ${Token}`,
        }
      }
    )
      .then(response => {
        const groups = response.data;
        console.log(groups,"--");
        const prevGroup = [];
        const temp = groups.channel.length
        for (let i = 0; i < temp; i++) {
          const receivedObj = groups.channel[i].Channel;
          console.log(i+" "+receivedObj.name,"---");
          prevGroup.push({ 'id': i, name: receivedObj.name , 'created_at': receivedObj.created_at})
        }

        for (let i = 0; i < groups.users.length; i++) {
          const receivedObj = groups.users[i].user;
          prevGroup.push({ 'id': i+temp, name: receivedObj.username, 'created_at': receivedObj.created_at })
        }

        setGroup(prevGroup.sort(function(a ,b){return a.created_at > b.created_at ? -1 : 1}))
      }).catch((error) => {
        console.log('Not Able to fetch Groups ');
      })
  }

  return (
    <>
      <div className="sidebar">
      {group.map((e, i) =>
        <div key={i} >

          <Link className="active" to="/chatroom/">
            <img
              src="https://www.w3schools.com/howto/img_avatar.png"
              alt="Avatar"
              className="avatar"
            />
            {e.name}
          </Link>
        </div>
      )}
      </div>
    </>
  );
}

export default Contact;
