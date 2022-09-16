import utils from "../../pages/auth/utils";
import React, { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import OrgChannel from "./OrginazationChannel";
import Sidebar from "../../pages/auth/Sidebar";
import Header from "../../pages/auth/Header";
import "./orginization.css";

import { Container } from "react-bootstrap";
import { Avatar, ListItemAvatar } from "@mui/material";
import { ImageShow } from "../ChatRoom/templates/MainChat/Chat";
export default function Orginization() {
    let Token = localStorage.getItem("token");
    let navigate = useNavigate();

    const [data, setData] = useState([])
    const [input, setInput] = useState('')
    const [output, setOutput] = useState([])
    const [show, setShow] = useState(false)
    const [orgId, setOrgId] = useState(null)
    const [orgName, setOrgName] = useState(null)

    async function getData() {
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
                    val.push({ "orgId": data[i]?.id, "orgName": data[i]?.meta_attributes, "owner": data[i]?.user.username })
                }
                setData(val)
                setOutput(val)
            })
    }

    useEffect(() => {
        getData()
    }, [])

    useEffect(() => {
        setOutput([])
        data.filter(val => {
            if (val.orgName.toLowerCase().includes(input.toLowerCase())) {
                setOutput(output => [...output, val])
            }
        })
    }, [input])

    const getChannels = (data) => {
        setOrgId(data.orgId || -1)
        setOrgName(data.orgName)
        setShow(!show)
    }
    const updateShow = (data) => {
        setShow(data.show)
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
                                        <div className='search-bar' id='search-center'>
                                            <p type="click"
                                                style={{ margin: '0px 10px', backgroundColor: 'transparent' }}
                                                className="button-upload-org" onClick={(data) => {
                                                    // handleSubmission()
                                                    console.log(data);
                                                }}>ADD New Orginization </p>
                                            <input onChange={e => setInput(e.target.value)}
                                                type="text" placeholder='Search orgnization' aria-label="Search "
                                            />
                                        </div>
                                        <hr style={{ width: '100%' }}></hr>
                                        <div className='output'>
                                            {output.map((e, i) => (
                                                <div key={i}>
                                                    <div style={{ background: 'skyblue', height: '90px', width: '80%', color: "white", padding: '5px', borderRadius: '10px' }}>
                                                        <ListItemAvatar >
                                                            <Avatar alt={e.orgName} src={e.owner} style={{
                                                                // padding: '5px',
                                                                alignItems: 'center',
                                                                height: '35px',
                                                                width: '35px'
                                                            }} />
                                                        </ListItemAvatar>
                                                        <div style={{
                                                            marginTop: "-25px",
                                                            paddingLeft: "80px"
                                                        }} onClick={() =>
                                                            getChannels(e)
                                                        }>
                                                            <p >ORGINIZATION: {e.orgName}</p>
                                                            <p >OWNER:  {e.owner}</p>
                                                        </div>

                                                    </div>
                                                    <hr style={{ width: '100%' }}></hr>

                                                </div>

                                            ))}
                                        </div>
                                    </Container>
                                    :
                                    <OrgChannel orgId={orgId} orgName={orgName} back={updateShow} />
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



