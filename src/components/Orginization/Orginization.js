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
export default function Orginization() {
    let Token = localStorage.getItem("token");
    let navigate = useNavigate();
    let login_user = JSON.parse(localStorage.getItem("user"));

    const [data, setData] = useState([])
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
                    if (data[i]?.user.username === login_user.username)
                        val.push({ "orgId": data[i]?.id, "orgName": data[i]?.meta_attributes, "owner": data[i]?.user.username })
                }
                setData(val)
                setOutput(val)
            })
    }

    useEffect(() => {
        getOrginizations()
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
                                                <h3>Orginization</h3>
                                            </div>
                                            <p type="click"
                                                style={{ float: 'right', backgroundColor: 'transparent' }}
                                                className="button-upload-org" onClick={(data) => {
                                                    // handleSubmission()
                                                    setShow(true)
                                                    setAddOrg(true)
                                                }}>ADD New Orginization </p>
                                            <p type="click"
                                                style={{ float: 'right', backgroundColor: 'transparent' }}
                                                className="button-upload-org" onClick={(data) => {
                                                    getOrginizations()
                                                }}>Refresh </p>
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
                                                <p style={{color:"red"}}>Looks like You don't have Orginization</p>
                                            }
                                        </div>
                                    </Container>
                                    :
                                    <>
                                        {showOrg ?
                                            <AddOrg goBack={goBack} />
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






export const AddOrg = (props) => {
    let Token = localStorage.getItem("token");
    let loginFields = [
        {
            placeholder: "Org name",
            value: "",
            name: "meta_attributes",
            type: "text",
            hasError: false,
        },
    ];


    const [fields, updateFields] = useState(loginFields);

    const setFieldValue = (value, index) => {
        let fieldData = [...fields];
        fieldData[index].value = value;
        fieldData[index].hasError = value === "";
        updateFields(fieldData);
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();
        let requestObject = {};
        fields.forEach((field) => {
            requestObject[field.name] = field.value;
        });
    };


    function addorg() {
        let items = [...fields];
        let valu = { meta_attributes: items[0].value };
        axios
            .post(
                `${utils.getHost()}/chat/get/org`,
                valu,
                {
                    headers: {
                        Authorization: `Bearer ${Token}`,
                    },
                }
            )
            .then((response) => {

                alert('Orginization is Added')
                props.goBack()
            })
            .catch((error) => {
                let errorFeedback = {
                    process: "Error",
                    feedback: "",
                    closable: true,
                };

            });
    }
    return (
        <>

            <div
                className={"login-section page-container"}
                style={{ display: "flex", padding: "0px" }}
            >
                <div className={"auth-container"}>
                    <Button onClick={() => {
                        props.goBack()
                    }}>Back </Button>
                    <div className={"auth-content"}>
                        <div className={"auth-header"}>
                            <h4>Add_Org</h4>
                        </div>

                        <form
                            method={"post"}
                            action={""}
                            onSubmit={(event) => handleFormSubmit(event)}
                            style={{ justifyContent: 'center' }}
                        >
                            <div className={"input-list centered-data"}>
                                {fields.map((field, index) => {
                                    return (
                                        <div className={`input-control`} key={index}>
                                            <input
                                                type={field.type}
                                                value={field.value}
                                                name={field.name}
                                                onChange={(event) =>
                                                    setFieldValue(event.target.value, index)
                                                }
                                                placeholder={field.placeholder}
                                                className={`${field.hasError ? "input-error" : ""}`}
                                            />
                                        </div>
                                    );
                                })}
                            </div>

                            <div>
                                <div className={"button-container "} style={{ marginTop: '100%' }}>
                                    <button onClick={addorg}>Add</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

            </div>

        </>
    );
};

