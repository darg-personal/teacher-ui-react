import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./UserGroup.css";
import utils from "../../pages/auth/utils";
import Card from "react-bootstrap/Card";
import { ImCross } from "react-icons/im";
import { Avatar } from "@mui/material";

let Token = localStorage.getItem("token");
let loggedUser = JSON.parse(localStorage.getItem("user"));

function UserGroup(props) {
  const navigate = useNavigate();
  const name = props.name;
  const type = props.type;
  const chatRoomId = props.chatRoomId;
  const image = props.image;
  const ws = props.websocket;
  const about = props.about;
  const [users, setUsers] = useState([]);
  let loggedUser = JSON.parse(localStorage.getItem("user"));

  const [isActive, setIsActive] = useState();

  const ImgUpload = ({ src }) => (
    <div>
      <label className="custom-file-upload">
        <div className="img-wrap">
          <img className="img-upload" src={src} />
        </div>
      </label>
    </div>
  );

  async function getUsers() {
    console.log({ chatRoomId });
    await axios
      .get(`${utils.getHost()}/chat/get/channel/user_list/${chatRoomId}`,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        })
      .then((res) => {
        const responseData = JSON.stringify(res.data);
        const tempUsers = JSON.parse(responseData);
        console.log(tempUsers, "09t7374j");
        let localUserUpdate = [];
        for (var i = 0; i < tempUsers?.length; i++) {
          localUserUpdate.push({
            'user': tempUsers[i]?.user.username,
            'image': tempUsers[i]?.image,
            'id': tempUsers[i]?.user.id,
          });
        }
        setUsers(localUserUpdate);
      });
  }

  useEffect(() => {
    getUsers();
  }, [name, chatRoomId, image]);

  function userinfo(value) {
    if (loggedUser.username !== value.user)
      props.reDirect({ name: value.user, image: value.image, id: value.id, type: 'user', websocket: ws });
  }

  let exitGroup = () => {
    axios
      .patch(`${utils.getHost()}/chat/get/channelmember/${chatRoomId}`,
        { 'designation': 2 },
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        })
      .then((res) => {
        const responseData = JSON.stringify(res.data);
        const message = JSON.parse(responseData);
        ws.send(
          JSON.stringify({
            meta_attributes: "react",
            message_type: "group-info-update",
            media_link: null,
            message_text: `${loggedUser.username} leave group`,
          })
        );
      }).then(() => {
        props.updateGrupinfo({ show: false, isConnected: -1, user: name });
      })
  }
  return (
    <>
      <Card
        style={{
          margin: "0px",
          width: "30rem",
          paddingLeft: "2px",
          textAlign: "left",
          left: "35%",
          height: "5rem",
        }}
      >
        <Card.Body>
          <Card.Text>
            <ul className="header-user">
              <li >
                <ImCross onClick={() => {
                  props.show({ show: false });
                }} />
              </li>
            </ul>
            <p style={{ margin: '10' }}>&emsp; Contact info</p>
          </Card.Text>
        </Card.Body>
      </Card>
      <Card
        style={{
          margin: "3px",
          textAlign: "center",
          width: "30rem",
          left: "35%",
          height: "auto",
        }}
      >
        <Card.Body>
          <Card.Text>
            <form>
              <ImgUpload src={image} />
              <p>{name}</p>
            </form>
          </Card.Text>
        </Card.Body>
      </Card>
      <Card
        style={{ margin: "3px", width: "30rem", left: "35%", height: "5rem" }}
      >
        <Card.Body>
          <span style={{ fontSize: '10px', color: 'gray' }}>About</span>
          <Card.Text style={{ color: 'black', padding: '3px' }}>{about}</Card.Text>
        </Card.Body>
      </Card>
      {type === 'Channel' ?
        <Card
          style={{ margin: "3px", width: "30rem", left: "35%", height: "auto" }}
        >
          <Card.Body>
            User's
            <hr></hr>
            {users.map((user, i) => {
              return (
                <>
                  <div key={i + user} onClick={() => { userinfo(user) }}>
                    <Card.Text className="d-flex justify-content-start" >
                      <Avatar alt={user.user} src={user.image} style={{ height: '30px', width: '30px' }} />
                      {
                        (loggedUser.username === user.user) ?
                          <snap style={{color : 'blue'}}>
                            {user.user} 
                          </snap>
                          :
                          <>
                            {user.user}
                          </>
                      }
                    </Card.Text>
                    <hr></hr>
                  </div>
                </>
              );
            })}
          </Card.Body>
        </Card>
        : null}
      <Card
        style={{ margin: "3px", width: "30rem", left: "35%", height: "7.5rem" }}
      >
        <Card.Body>
          <Card.Text>Block {name}</Card.Text>
          <Card.Text>Report {name}</Card.Text>
          {type === 'Channel' ?
            <Card.Text style={{ color: "blue" }} onClick={exitGroup}>Exit Group</Card.Text>
            : null} </Card.Body>
      </Card>
    </>
  );
}

export default UserGroup;
