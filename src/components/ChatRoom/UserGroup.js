import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./UserGroup.css";
import Avatar from "../../assets/Images/avatar.svg";
import utils from "../../pages/auth/utils";
import Card from "react-bootstrap/Card";
import { ImCross } from "react-icons/im";

let Token = localStorage.getItem("token");
let loggedUser = JSON.parse(localStorage.getItem("user"));

function UserGroup(props) {
  const navigate = useNavigate();
  const name = props.name;
  const type = props.type;
  const chatRoomId = props.chatRoomId;
  const image = props.image;
  const ws = props.websocket;
  const [users, setUsers] = useState([]);
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

  function getUsers() {
    console.log({ chatRoomId });
    axios
      .get(`${utils.getHost()}/chat/get/channel/user_list/${chatRoomId}`,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        })
      .then((res) => {
        const responseData = JSON.stringify(res.data);
        const message = JSON.parse(responseData);
        console.log(message, "09t7374j");
        let value = [];
        for (var i = 0; i < message.length; i++) {
          value.push({
            'user': message[i]?.user.username,
            'image': message[i]?.user_profile.image,
            'id': message[i]?.user.id,
          });
        }
        setUsers(value);
      });
  }

  useEffect(() => {
    getUsers();
  }, []);

  function userinfo(value) {
    props.reDirect({ name: value.user, image: value.image, id: value.id, type: 'user' });
  }

  let exitGroup = () => {
    axios
      .patch(`${utils.getHost()}/chat/get/channelmember/${chatRoomId}`,
        { 'designation': "leave" },
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
        props.updateGrupinfo({ show: false, isConnected: 'leave' });
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
          <Card.Text>About</Card.Text>
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
                  <div key={i} onClick={() => { userinfo(user) }}>
                    <Card.Text onClick={getUsers}>
                      <img src={user.image} height={20} width={20} />
                      {user.user}
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
