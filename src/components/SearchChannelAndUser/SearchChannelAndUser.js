import utils from "../../pages/auth/utils";
import React, { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../pages/auth/Sidebar";
import Header from "../../pages/auth/Header";
import "./SearchChannelAndUser.css";
import "../../css/auth/auth.scss";

import { Button, Container } from "react-bootstrap";
import { Avatar, ListItemAvatar } from "@mui/material";

const requestType = {
    cancel: "0",
    Joined: '1',
    Requested: "2"
}

export default function SearchChannelAndUser() {
    let Token = localStorage.getItem("token");
    let login_user = JSON.parse(localStorage.getItem("user"));

    const [output, setOutput] = useState([])
    const [status, setStatus] = useState(2)

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
                console.log(login_user.id);
                for (let i = 0; i < tempData.length; i++) {
                    if (tempData[i]?.org?.user?.username !== login_user.username)
                        val.push({
                            "image": tempData[i]?.image,
                            "orgId": tempData[i]?.org?.id, "orgName": tempData[i]?.org?.meta_attributes, "ChannelId": tempData[i]?.id,
                            "ChannelName": tempData[i]?.name,
                            "owner": tempData[i]?.org?.user?.username, "about": tempData[i]?.about
                        })

                }

                console.log({ val });
                setOutput(val)
            })
    }

    useEffect(() => {
        getOrginizations()
    }, [])

    const senRequest = async (data) => {
        let value = { org: data.orgId, Channel: data.ChannelId, user: login_user.id }
        const res = await axios.post(
            `${utils.getHost()}/chat/userRequest/${login_user.id}`,
            value,
            {
                headers: { Authorization: ` Bearer ${Token}` },
            }
        );
        setStatus(res?.data?.request_type)
        console.log('request data', res?.data?.request_type)

    }

    return (
        <>
            {
                Token ? (
                    <div className="dashboard-wrapper">
                        <Sidebar />
                        <div className="header-main">
                            <Header />
                            <div className='App'>
                                <Container>
                                    <div className="d-flex justify-content-center">
                                    <h3>Groups / Users</h3>
                                    </div>
                                    <div className='d-flex' style={{marginLeft:'15px'}} >
                                        <input onChange={e => console.log("setInput(e.target.value)")}
                                            type="text" placeholder='Search User/Group/...' aria-label="Search "
                                    />
                                        <p type="click"
                                            style={{ backgroundColor: 'transparent' }}
                                            className=" button-upload-org justify-content-right" onClick={(data) => {
                                                getOrginizations()
                                            }}>Refresh </p>
                                    </div>
                                    <hr style={{ width: '100%' }}></hr>
                                    {output.length >0 ?
                                    <div className='output'>
                                        {output.map((e, i) => (
                                            <div key={i}>
                                                <div style={{
                                                    background: 'skyblue', height: 'auto',
                                                    width: '80%', color: "white", padding: '5px',
                                                    borderRadius: '10px'
                                                }}>
                                                    <ListItemAvatar >
                                                        <Avatar alt={e.orgName} src={e.image} style={{
                                                            // padding: '5px',
                                                            alignItems: 'center',
                                                            height: '35px',
                                                            width: '35px'
                                                        }} />
                                                    </ListItemAvatar>
                                                    <div style={{
                                                        marginTop: "-25px",
                                                        paddingLeft: "80px"
                                                    }} >
                                                        <span >Channel Name : {e.ChannelName}</span>
                                                        {requestType.Requested == status ?
                                                            <span style={{ float: 'right' }} >
                                                                <Button onClick={() => { senRequest(e) }
                                                                }>Request</Button>
                                                            </span> : requestType.Joined == status ?
                                                                <span style={{ float: 'right' }} >
                                                                    <Button onClick={() => { senRequest(e) }
                                                                    }>Joined</Button>
                                                                </span> : <span style={{ float: 'right' }} >
                                                                    <Button onClick={() => { senRequest(e) }
                                                                    }>Cancel</Button>
                                                                </span>}
                                                        <p >ORGINIZATION: {e.orgName}</p>
                                                        <span style={{ float: 'right' }} >About : {e.about}</span>
                                                        <p >OWNER:  {e.owner}</p>
                                                    </div>

                                                </div>
                                                <hr style={{ width: '100%' }}></hr>
                                            </div>
                                        ))}
                                    </div>
                                    : 
                                    <div className="d-flex justify-content-center">
                                        <h1>No Groups/ User To Show</h1>
                                    </div>
}
                                </Container>


                            </div>
                        </div>
                    </div>
                )
                    : (
                        <Navigate replace to="/login" />
                    )}
        </>
    )
}
