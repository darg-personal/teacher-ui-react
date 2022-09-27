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
    terminated: -1
}

const UserRequest = (props) => {
    let Token = localStorage.getItem("token");

    const org = props.orgId
    const channel = props.channelId
    const ws = props.ws
    const [reqUsers, setReqUsers] = useState([]);
    const [temp, setTemp] = useState({ request: {} })

    const getRequests = (org, channel) => {
        axios
            .get(`${utils.getHost()}/chat/userRequest/${org}/${channel}`,
                {
                    headers: {
                        Authorization: `Bearer ${Token}`,
                    },
                })
            .then((res) => {
                const responseData = JSON.stringify(res.data);
                const tempResponse = JSON.parse(responseData);
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

    useEffect(() => {
        getRequests(org, channel)
        console.log(org, channel);
    }, [org, channel]);

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
            ).then(()=>
            {
                ws.send(
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
                console.log(temp);
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

    return (
        <>
            {
                Token ? (
                    <>
                        <Card style={{ height: '100%', width: '70%', marginLeft: '10px', padding: '10px', borderWidth: 1 }}>
                            <Card style={{ margin: '10px', padding: '10px', borderWidth: 1, display: 'flex' }}>
                                Group : {props.channelName}
                                {/* {props.orgName} */}
                            </Card>
                            {reqUsers.length > 0 ?
                                <>
                                    {
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
                                    }
                                </>
                                : <p style={{ alignSelf: 'center' }} >No New Requests</p>}
                        </Card>


                    </>)
                    : (
                        <Navigate replace to="/login" />
                    )}

        </>
    );
};

export default UserRequest;
