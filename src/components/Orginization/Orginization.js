import utils from "../../pages/auth/utils";
import React, { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import OrgChannel from "./OrginazationChannel";
import Sidebar from "../../pages/auth/Sidebar";
import Header from "../../pages/auth/Header";
import "./orginization.css";
import "../../css/auth/auth.scss";
import Modal from "../../components/AuthModal/Modal";
import swal from "sweetalert";
import "./addorg.css";


import { Button, Container } from "react-bootstrap";
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
    const [showOrg, setAddOrg] = useState(false)
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
    const goBack = () =>
    {
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
                                            <p type="click"
                                                style={{ float: 'right', backgroundColor: 'transparent' }}
                                                className="button-upload-org" onClick={(data) => {
                                                    // handleSubmission()
                                                    setShow(true)
                                                    setAddOrg(true)
                                                }}>ADD New Orginization </p>
                                            {/* <input onChange={e => setInput(e.target.value)}
                                                type="text" placeholder='Search orgnization' aria-label="Search "
                                            /> */}
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
                                    <>
                                        {showOrg ?
                                            <AddOrg goBack={goBack}/>
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

    let feedbackObject = {
        process: "",
        feedback: "",
        closable: false,
    };

    const [fields, updateFields] = useState(loginFields);
    let resetTimeout = useRef(null);

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

    function getUsers() {
        axios
            .get(`${utils.getHost()}/chat/get/org`, {
                headers: {
                    Authorization: `Bearer ${Token}`,
                },
            })
            .then((res) => {
                const responseData = JSON.stringify(res.data);
                const message = JSON.parse(responseData);
                let value = [];
                for (var i = 0; i < message.length; i++) {
                    //   value.push({
                    // user: message[i]?.user.meta_attributes,
                    //    'image': message[i]?.user_profile.image ,
                    // id: message[i]?.user.id,
                    //   });
                }
            });
    }

    useEffect(() => {
        getUsers();
    }, []);

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

