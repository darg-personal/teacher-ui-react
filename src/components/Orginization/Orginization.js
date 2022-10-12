import utils from "../../pages/auth/utils";
import React, { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import OrgChannel from "./OrginazationChannel";
import Sidebar from "../../pages/auth/Sidebar";
import Header from "../../pages/auth/Header";
import "./orginization.css";
import "../../css/auth/auth.scss";
import "./addorg.css";

import { Button, Container } from "react-bootstrap";
import { Avatar, ListItemAvatar } from "@mui/material";
import { ImageShow } from "../ChatRoom/templates/MainChat/Chat";
import { AddOrg } from "./OrginizationAdd";
export default function Orginization() {
    let Token = localStorage.getItem("token");
    let navigate = useNavigate();
    let login_user = JSON.parse(localStorage.getItem("user"));

    const [input, setInput] = useState('')
    const [output, setOutput] = useState([])
    const [show, setShow] = useState(false)
    const [orgId, setOrgId] = useState(null)
    const [orgName, setOrgName] = useState(null)
    const [showOrg, setAddOrg] = useState(false)
    async function getOrginizations() {
        axios
            .get(`${utils.getHost()}/chat/get/org`, {
                headers: {
                    Authorization: `Bearer ${Token}`,
                },
            })
            .then(response => {
                const responseData = JSON.stringify(response.data);
                const data = JSON.parse(responseData);
                let val = []
                console.log(data);
                for (let i = 0; i < data.length; i++) {
                        val.push({
                            "orgId": data[i]?.id,
                            "orgName": data[i]?.meta_attributes,
                            "owner": data[i]?.user.username
                        })
                }
                setOutput(val)
            })
    }

    useEffect(() => {
        getOrginizations()
    }, [])

    // useEffect(() => {
    //     setOutput([])
    //     data.filter(val => {
    //         if (val.orgName.toLowerCase().includes(input.toLowerCase())) {
    //             setOutput(output => [...output, val])
    //         }
    //     })
    // }, [input])

    const getChannels = (data) => {
        setOrgId(data.orgId || -1)
        setOrgName(data.orgName || -1)
        setShow(!show)
    }
    const updateShow = (data) => {
        setShow(data.show)
    }
    const goBack = () => {
        setShow(false)
        setAddOrg(false)
    }

    const updateNewOrginization = (data) => {
        goBack()
        let val = []
        val.push({
            "orgId": data?.orgId,
            "orgName": data?.meta_attributes,
            "owner": login_user.username
        })
        setOutput([...val,...output])
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
                                {!show ?
                                    <Container>
                                        <div className='search-bar' >
                                            <div className="d-flex justify-content-center">
                                                <h3>Orginization's</h3>
                                            </div>
                                            <p type="click"
                                                style={{ float: 'right' }}
                                                className="button-upload-org" onClick={(data) => {
                                                    // handleSubmission()
                                                    setShow(true)
                                                    setAddOrg(true)
                                                }}>ADD New Orginization </p>
                                            {/* <p type="click"
                                                style={{ float: 'right', backgroundColor: 'transparent' }}
                                                className="button-upload-org" onClick={(data) => {
                                                    getOrginizations()
                                                }}>Refresh </p> */}
                                        </div>
                                        <hr style={{ width: '100%' }}></hr>
                                        <div className='output'>
                                            {output.length > 0 ?
                                                <>
                                                    {output.map((e, i) => (
                                                        <div key={i}>
                                                            <div style={{
                                                                background: 'skyblue', height: '90px',
                                                                marginLeft: '25px', width: '80%', color: "white", padding: '5px',
                                                                borderRadius: '10px', display: 'flex'
                                                            }} onClick={() =>
                                                                getChannels(e)
                                                            }>
                                                                <ListItemAvatar >
                                                                    <Avatar alt={e.orgName} src={e.owner} style={{
                                                                        alignItems: 'center',
                                                                        height: '35px',
                                                                        width: '35px'
                                                                    }} />
                                                                </ListItemAvatar>
                                                                <div >
                                                                    <p >ORGINIZATION: {e.orgName}</p>
                                                                    <p >OWNER:  {e.owner}</p>
                                                                </div>
                                                            </div>
                                                            <hr style={{ width: '100%' }}></hr>
                                                        </div>
                                                    ))}
                                                    <h6 className="d-flex justify-content-center"> No More Orginizations ...</h6>
                                                </>
                                                :
                                                <p style={{ color: "red" }}>Looks like you don't have Orginization</p>
                                            }
                                        </div>
                                    </Container>
                                    :
                                    <>
                                        {showOrg ?
                                            <AddOrg goBack={goBack} updateNewOrginization={updateNewOrginization} />
                                            :
                                            <OrgChannel orgId={orgId} orgName={orgName} back={updateShow} />
                                        }
                                    </>
                                    // null
                                }
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


