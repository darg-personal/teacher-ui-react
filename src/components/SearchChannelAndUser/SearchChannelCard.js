import utils from "../../pages/auth/utils";
import React, { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { Card } from 'react-bootstrap'
import { Row, Col } from 'react-bootstrap';
import { Avatar, ListItemAvatar } from "@mui/material";
import { flexbox, fontSize } from '@mui/system';
import { Button, Container } from "react-bootstrap";

const requestType = {
    Leave: 0,
    Request: 1,
    reRequest: 2,
    cancel: 3,
    terminated: 4
}
function SearchChannelCard(props) {
    let Token = localStorage.getItem("token");
    let login_user = JSON.parse(localStorage.getItem("user"));

    let About = props.About
    const [request, setRequest] = useState({})

    async function getOrginizations() {
        axios
            .get(`${utils.getHost()}/chat/get/user_and_group_list/`, {
                headers: {
                    Authorization: `Bearer ${Token}`,
                },
            })
            .then(response => {
                const responseData = JSON.stringify(response.data);
                const data = JSON.parse(responseData);
                let val = []
                let tempData = data.results
                for (let i = 0; i < tempData.length; i++) {
                    if (tempData[i]?.org != 1)
                        if (tempData[i]?.org?.user?.username !== login_user.username) {
                            const uniqueId = tempData[i].type + tempData[i]?.org?.id + tempData[i]?.id
                            console.log(uniqueId, tempData[i]?.requested, " =-= ");
                            var req = request;
                            req[uniqueId] = tempData[i]?.requested;
                            setRequest({
                                ...request,
                                req
                            });
                        }
                }
            })
    }

    useEffect(() => {
        getOrginizations()
    }, [])

    const sendRequest = async (data) => {
        let value = { org: data.orgId, Channel: data.ChannelId, user: login_user.id }
        const res = await axios.post(
            `${utils.getHost()}/chat/userRequest/${login_user.id}`,
            value,
            {
                headers: { Authorization: ` Bearer ${Token}` },
            }
        );
        setRequest({
            ...request,
            [data.type + data.orgId + data.ChannelId]: 3,
        });

    }

    const sendCancleRequest = async (data) => {
        let value = { org: data.orgId, Channel: data.ChannelId, user: login_user.id }
        const res = await axios.delete
            (`${utils.getHost()}/chat/userRequest/${data.orgId}/${data.ChannelId}`,
                {
                    headers: { Authorization: ` Bearer ${Token}` },
                }
            ).then(() => {
                setRequest({
                    ...request,
                    [data.type + data.orgId + data.ChannelId]: 1,
                });
            })
    }

    const callWebSocket = (data) => {
        var ws = new WebSocket(
            `${utils.getWebsocketHost()}/msg/channel/?token=${Token}&roomname=${data.ChannelName}`)
        ws.onopen = () => {
            console.log("Web Socket is connected");
        }

        return ws;
    }
    const leaveRequest = async (data) => {
        console.log(data);
        let webSocket = callWebSocket(data)
        setTimeout(() => {
            axios
                .patch(`${utils.getHost()}/chat/get/channelmember/${data.ChannelId}`,
                    { 'designation': 2 },
                    {
                        headers: {
                            Authorization: `Bearer ${Token}`,
                        },
                    })
                .then((res) => {
                    const responseData = JSON.stringify(res.data);
                    const message = JSON.parse(responseData);
                    webSocket.send(
                        JSON.stringify({
                            meta_attributes: "react",
                            message_type: "group-info-update",
                            media_link: null,
                            message_text: `${login_user.username} leave group`,
                        })
                    );
                }).then(() => {
                    webSocket.close()
                })

            setRequest({
                ...request,
                [data.type + data.orgId + data.ChannelId]: 1,
            });
        }, 5000);
    }
    return (
        <div style={{ marginLeft: '200px' }}>
            <Card className='my-3 p-3 rounded' style={{ width: "300px", display: "flex", flexWrap: 'wrap' }}>

                <ListItemAvatar >
                    <Avatar alt={About.orgName} src={About.image}
                        style={{
                            height: '50px',
                            width: '50px',
                            backgroundColor: 'red',alignItems:'center'
                        }} />

                </ListItemAvatar>

                <div style={{marginTop:'3px'}}>
                        <span >Channel Name : {About.ChannelName}</span>
                        <p >ORGINIZATION: {About.orgName}</p>
                        <span  >About : {About.about}</span>
                    {requestType.terminated == request[About.type + About.orgId + About.ChannelId] &&
                        <span style={{ float: 'right' }} >
                            <Button disabled class="btn btn-secondary">Request</Button>
                        </span>}
                    {(requestType.Request == request[About.type + About.orgId + About.ChannelId]
                        ||
                        requestType.reRequest == request[About.type + About.orgId + About.ChannelId])
                        &&
                        <span style={{ float: 'right' }} >
                            <Button onClick={() => { sendRequest(About) }
                            }>Request</Button>

                        </span>}
                    {requestType.Leave == request[About.type + About.orgId + About.ChannelId] &&
                        <span style={{ float: 'right' }} >
                            <Button onClick={() => { leaveRequest(About) }
                            }>Leave</Button>
                        </span>}

                    {requestType.cancel == request[About.type + About.orgId + About.ChannelId]
                        && <span style={{ float: 'right' }} >
                            <Button onClick={() => { sendCancleRequest(About) }
                            }>Cancel</Button>
                        </span>}
                </div>
            </Card>
        </div>

    )
}

export default SearchChannelCard