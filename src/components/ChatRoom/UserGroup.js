import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./UserGroup.css";
import Avatar from "../../assets/Images/avatar.svg";
import utils from "../../pages/auth/utils";
import Card from "react-bootstrap/Card";
import { ImCross } from "react-icons/im";

let Token = localStorage.getItem("token");

function UserGroup(props) {
  const navigate = useNavigate();
  const name = props.name;
  const type = props.type;
  const chatRoomId = props.chatRoomId;
  const image = props.image;
  const [users, setUsers] = useState([]);

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
    axios
      .get(`${utils.getHost()}/chat/get/channel/user_list/${chatRoomId}`, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      })
      .then((res) => {
        const responseData = JSON.stringify(res.data);
        const message = JSON.parse(responseData);
        let value = [];
        for (var i = 0; i < message.length; i++) {
          value.push({ 'user': message[i]?.user.username,
           'image': message[i]?.user_profile.image });
        }
        setUsers(value);
      });
  }

  useEffect(() => {
    getUsers();
  }, []);
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
          <Card.Text
            onClick={() => {
              props.show({ show: false });
            }}
          >
            <ul className="header-user">
              <li >
                <ImCross />
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
            {users.map((e,i) => {
              return (
                <>
                <div key={i} >

                  <Card.Text onClick={getUsers}>
                    <img src={e.image} height={20} width={20} />
                    {e.user}
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
          <Card.Text>{/* Delete chat */}</Card.Text>
        </Card.Body>
      </Card>
    </>
  );
}

export default UserGroup;
