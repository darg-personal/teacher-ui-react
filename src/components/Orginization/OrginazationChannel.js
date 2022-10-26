import { React, useState } from "react";
import axios from "axios";
import utils from "../../pages/auth/utils";
import { useEffect } from "react";
import { Avatar, Button, ListItemAvatar } from "@mui/material";
import { Card, Container } from "react-bootstrap";
import UserRequest from "./channelPage";

import { CreateChannelPage } from "./ChannelAdd";
import { Delete } from "@mui/icons-material";
let Token = localStorage.getItem("token");
let loggedUser = JSON.parse(localStorage.getItem("user"));

function OrgChannel(props) {
    const orgId = props.orgId
    const orgName = props.orgName

    const [users, setUsers] = useState([]);
    const [channelId, setChannelId] = useState(null);
    const [channelName, setChannelName] = useState(null);
    const [orgData, setOrgData] = useState({ orgId: null, channelId: null, orgName: null, channelName: null });
    const [showAddChannelPage, setShowAddChannelPage] = useState(false);
    const [requestPageVisible, setRequestPageVisible] = useState(false);
    const [websocket, setWebSocket] = useState(false);
    const [groupIsExist, setgroupIsExist] = useState(true);

    async function getChannels() {
        await axios
            .get(`${utils.getHost()}/chat/get/channel/${orgId}`, {
                headers: {
                    Authorization: `Bearer ${Token}`,
                },
            })
            .then((response) => {
                const responseData = JSON.stringify(response.data);
                const value = JSON.parse(responseData);
                console.log({ value });
                let data = []
                for (let i = 0; i < value.length; i++) {
                    data.push({
                        'orgId': value[i]?.org,
                        'name': value[i]?.name,
                        'profile': value[i]?.image,
                        'isExist': value[i]?.isExist,
                        'channelId': value[i]?.id
                    })
                }
                setUsers(data);
            });
    }

    useEffect(() => {
        getChannels();
    }, []);

    const goBack = () => {
        setShowAddChannelPage(false)
    }
    const channelCreated = (data) => {
        console.log(data?.channeName);
        let temp = []
        temp.push({
            'orgId': orgId,
            'name': data?.channeName,
            'profile': data?.channelThumb,
            'isExist': data?.isExist,
            'channelId': data?.channelId,
        })
        setUsers([...temp,...users])
        setShowAddChannelPage(false)
    }

    const navigateToRequestPage = (data) => {
        setChannelId(data.channelId);
        setChannelName(data.name)
        var ws = new WebSocket(
            `${utils.getWebsocketHost()}/msg/channel/?token=${Token}&roomname=${data.name}`)
        ws.onopen = () => {
            console.log("Web Socket is connected");
        }
        setWebSocket(ws)
        setgroupIsExist(data.isExist != 5)
        setRequestPageVisible(true)
    }

    const deleteChannel = (data) => {
        var ws = new WebSocket(
            `${utils.getWebsocketHost()}/msg/channel/?token=${Token}&roomname=${data.name}`)
        ws.onopen = () => {
            console.log("Web Socket is connected");
        }
        setTimeout(() => {
            let value = { "isExist": "5" }
            axios.patch(`${utils.getHost()}/chat/get/channel/${data?.channelId}`,
                value,
                {
                    headers: { Authorization: ` Bearer ${Token}` },
                }
            )
                .then((data) => {

                    ws.send(
                        JSON.stringify({
                            meta_attributes: "react",
                            message_type: "group-info-update",
                            media_link: null,
                            message_text: `The Owner Delete This Channel`,
                        })
                    );

                }).then(() => {
                    ws.close()
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }, 5000);
    }

    function Channels() {
        return <>
            <div style={{
                width: '25%',
                overflow: 'auto',
            }}>
                {users.length > 0 ?
                    <>
                        {users.map((user, i) => (
                            <div key={i}>
                                <div style={{
                                    background: 'darkblue', height: 'auto',
                                    marginLeft: '10px',
                                    color: "white", padding: '5px', borderRadius: '10px'
                                }}
                                >
                                    <ListItemAvatar style={{ display: 'flex' }}>
                                        <Avatar alt={user.name} src={user.profile} style={{
                                            alignItems: 'center',
                                            margin: '5px',
                                            height: '35px',
                                            width: '35px'
                                        }} />
                                        <p style={{ float: 'right', justifyContent: 'center', margin: '10px 10px' }}>{user.name}</p>
                                    </ListItemAvatar>
                                    <p style={{ justifyContent: 'center', margin: '10px 55px' }}>About Section</p>
                                    {!false ?
                                        <>
                                            {user.isExist != 5 &&
                                                <Delete style={{
                                                    float: 'right', justifyContent: 'center',
                                                    margin: '-80px 0px'
                                                }}
                                                    onClick={() => {
                                                        deleteChannel(user)
                                                    }}
                                                />
                                            }
                                            <Button style={{
                                                float: 'right', justifyContent: 'center',
                                                margin: '-60px 10px'
                                            }}
                                                onClick={() => {
                                                    navigateToRequestPage(user)
                                                }}
                                            > {'show >'} </Button>
                                        </>
                                        :
                                        <>
                                            <span style={{ float: 'right', justifyContent: 'center', margin: '-50px 10px' }}>x Cancel</span>
                                            <span style={{ float: 'right', justifyContent: 'center', margin: '-50px 100px' }}>Requested</span>
                                        </>
                                    }
                                </div>
                                <hr style={{ width: '100%' }}></hr>
                            </div>
                        ))}
                        <span className="d-flex justify-content-center">---end---</span>
                    </> :
                    <p>Channel's Not Exist</p>
                }
            </div>
        </>
    }
    return (
        <>
            <div >
                {!showAddChannelPage ?
                    <>
                        <Container>
                            <Button style={{ justifyContent: 'center', margin: '-50px 10px' }} onClick={() => {
                                props.back({ show: false })
                            }}>Back </Button>
                            <Card >
                                <p style={{ fontSize: '25px', fontFamily: 'bold', alignSelf: 'center' }}>Orginization : {orgName}</p>
                            </Card>
                            <p className="button-upload-org1" style={{ float: 'right' }}
                                onClick={() => setShowAddChannelPage(true)}>Add New Channel</p>

                            <p className="button-upload-org2" style={{ float: 'left' }}
                            // onClick={() => getChannels()}
                            >{orgName} Channel's</p>
                            <hr style={{ width: '100%' }}></hr>

                        </Container>
                        <div style={{ display: 'flex' }}>
                            <Channels />

                            {requestPageVisible && groupIsExist &&
                                <UserRequest channelId={channelId}
                                    channelName={channelName}
                                    orgId={orgId}
                                    orgName={orgName}
                                    ws={websocket}
                                />
                            }
                            {!groupIsExist &&
                                <div className="d-flex justify-content-center">
                                    alert("Group Is Deleted")
                                </div>}
                        </div>
                    </>

                    :
                    <CreateChannelPage channelCreated={channelCreated} orgId={orgId} goBack={goBack} />
                }
            </div>
        </>
    )
}
export default OrgChannel;
