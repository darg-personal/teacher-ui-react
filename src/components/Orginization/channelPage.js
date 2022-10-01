import React, { useEffect, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import utils from "../../pages/auth/utils";
import Avatar from "@mui/material/Avatar";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import { Button, Card } from "react-bootstrap";

const requestType = {
    Leave: 0,
    Request: 1,
    cancel: 3,
    terminated: 4
}

const UserRequest = (props) => {
    let Token = localStorage.getItem("token");
    let loggedUser = JSON.parse(localStorage.getItem("user"));

    const org = props.orgId
    const channel = props.channelId
    const ws = props.ws
    const [reqUsers, setReqUsers] = useState([]);
    const [removeBtn, setRemoveBtn] = useState({ user: {} })

    const [isClicked, setIsClicked] = useState(true);
    const [users, setUsers] = useState([]);

    const getRequests = async (org, channel) => {
        await axios
            .get(`${utils.getHost()}/chat/userRequest/${org}/${channel}`,
                {
                    headers: {
                        Authorization: `Bearer ${Token}`,
                    },
                })
            .then((res) => {
                const responseData = JSON.stringify(res.data);
                const tempResponse = JSON.parse(responseData);
                console.log({ tempResponse });
                let reqTempUsers = [];
                for (var i = 0; i < tempResponse.length; i++) {
                    if (tempResponse[i]?.request_type == 3) {
                        console.log(tempResponse[i]);
                        reqTempUsers.push({
                            requestId: tempResponse[i]?.id,
                            user: tempResponse[i]?.user.username,
                            id: tempResponse[i]?.user.id,
                            request: tempResponse[i]?.request_type,
                            channel: tempResponse[i]?.Channel,
                        });
                    }
                }
                setReqUsers(reqTempUsers);
            });
    }

    const getUsers = async () => {
        console.log({ channel });
        await axios
            .get(`${utils.getHost()}/chat/get/channel/user_list/${channel}`,
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
                    var remove = removeBtn;
                    const uniqueId = tempUsers[i]?.user.id + tempUsers[i]?.user.username
                    remove[uniqueId] = true;
                    setRemoveBtn({
                        ...removeBtn,
                        remove
                    });
                }
                setUsers(localUserUpdate);
            });
    }

    useEffect(() => {
        getRequests(org, channel);
    }, [org, channel]);

    useEffect(() => {
        getUsers();
    }, [])

    function addChannelMember(data) {
        console.log(data);
        let valu = { Channel: data.channel, designation: 0, user: data.id, org: org };
        axios
            .post(
                `${utils.getHost()}/chat/get/channelmember`,
                valu,
                {
                    headers: {
                        Authorization: `Bearer ${Token}`,
                    },
                }
            ).then(async () => {
                await ws.send(
                    JSON.stringify({
                        meta_attributes: "react",
                        message_type: "group-info-update",
                        media_link: null,
                        message_text: `${data.user} joined group`,
                    })
                );
            })
            .then((response) => {
                axios
                    .delete(
                        `${utils.getHost()}/chat/userRequest/${data.requestId}`,
                        {
                            headers: {
                                Authorization: `Bearer ${Token}`,
                            },
                        }
                    ).then(() => {
                        getRequests(org, channel)
                    }).catch(() => {
                        console.log("error");
                    })
                alert('User is Added or group')
            }).catch((error) => {
                console.log("Post Channel Member Error ", error);
            })

    }

    function rejectChannelMember(data) {
        axios
            .delete(
                `${utils.getHost()}/chat/userRequest/${data.requestId}`,
                {
                    headers: {
                        Authorization: `Bearer ${Token}`,
                    },
                }
            ).then(() => {
                getRequests(org, channel)
            }).catch(() => {
                console.log("error");
            })
    }

    function removeUser(data) {

        let valu = { Channel: data.channel, designation: 4, user: data.id, org: org };

        axios
            .patch(
                `${utils.getHost()}/chat/get/channelmember/${channel}`,
                valu,
                {
                    headers: {
                        Authorization: `Bearer ${Token}`,
                    },
                }
            ).then((resp) => {

                setRemoveBtn({
                    ...removeBtn,
                    [data.id + data.user]: false
                });
                ws.send(
                    JSON.stringify({
                        meta_attributes: "react",
                        message_type: "group-info-update",
                        media_link: null,
                        message_text: `${data.user} is removed by Admin`,
                    })
                );
            })
    }
    return (
        <>
            {
                Token ? (
                    <>
                        <Card style={{ height: '100vh', width: '70%', marginLeft: '10px', padding: '10px', borderWidth: 1, display: 'flex' }}>
                            <Card style={{ margin: '10px', padding: '10px', borderWidth: 1, display: 'flex' }}>
                                Group : {props.channelName}
                                {/* {props.orgName} */}
                            </Card>
                            <Card style={{ margin: '10px', padding: '10px', borderWidth: 1, display: 'flex' }}>
                                <div className="d-flex justify-content-between">

                                    <Button style={{ margin: '10px', padding: '10px', background: isClicked ? 'blue' : 'white', color: isClicked ? '#fff' : "#aaa" }}
                                        onClick={() => setIsClicked(true)}
                                    >
                                        Request's
                                    </Button>
                                    <Button style={{ margin: '10px', padding: '10px', background: !isClicked ? 'blue' : 'white', color: !isClicked ? '#fff' : '#aaa' }}
                                        onClick={() => setIsClicked(false)}
                                    >
                                        Connected User's
                                    </Button>
                                </div>
                            </Card>

                            {isClicked &&
                                <>
                                    {reqUsers.length > 0 ?
                                        reqUsers.map((e, i) => (
                                            <div key={e + i} >
                                                <Card  >
                                                    <div>
                                                        <ListItemAvatar>
                                                            <Avatar src={e.user} alt={e.user} />
                                                        </ListItemAvatar>
                                                        {e.user}
                                                        <Button style={{ float: 'right', margin: '2px' }}
                                                            onClick={() => {
                                                                addChannelMember(e)
                                                            }}>accept</Button>
                                                        <Button style={{ float: 'right', margin: '2px' }}
                                                            onClick={() => {
                                                                rejectChannelMember(e)
                                                            }}>reject</Button>
                                                    </div>
                                                </Card>
                                                <hr />
                                            </div>
                                        ))
                                        :
                                        <div>
                                            <p style={{ alignSelf: 'center' }} >No New Requests</p>
                                        </div>
                                    }
                                </>
                            }

                            {!isClicked &&
                                <>
                                    {users.map((user, i) => {
                                        return (
                                            <div key={i + user} >
                                                <Card.Text className="d-flex justify-content-start" >
                                                    <Avatar alt={user.user} src={user.image} style={{ height: '30px', width: '30px' }} />
                                                    {
                                                        (loggedUser.username === user.user) ?
                                                            <>
                                                                <span style={{ color: 'blue' }}>
                                                                    {user.user}
                                                                </span>
                                                                <span style={{ marginLeft: '10px', float: 'right' }}>Owner</span>
                                                            </>
                                                            :
                                                            <span>
                                                                {user.user}
                                                            </span>
                                                    }

                                                </Card.Text>
                                                {loggedUser.username !== user.user && removeBtn[user.id +user.user] &&
                                                    <Button style={{ position: 'relative', float: 'right', margin: '2px' }}
                                                        onClick={() => removeUser(user)}>remove</Button>
                                                }
                                                <hr></hr>
                                            </div>
                                        );
                                    })}
                                </>
                            }
                        </Card>
                    </>)
                    : (
                        <Navigate replace to="/login" />
                    )}

        </>
    );
};

export default UserRequest;
