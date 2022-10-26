import React, { useEffect, useRef, useState } from 'react'
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import {Container,Row,Col} from 'react-bootstrap';
import OrgChannel from "./OrginazationChannel";
import Sidebar from "../../pages/auth/Sidebar";
import Header from "../../pages/auth/Header";
import utils from "../../pages/auth/utils";
import "./orginization.css";
import "../../css/auth/auth.scss";
import "./addorg.css";
import OrgCard from "./OrginizationCard";
import { AddOrg } from "./OrginizationAdd";
export default function Orginization() {
    let Token = localStorage.getItem("token");
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
                            "owner": data[i]?.user.username,
                            "email":data[i]?.email,
                            "phone_number":data[i]?.phone_number,
                            "about":data[i]?.about,
                            "thumb":data[i]?.image
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
            "owner": data?.user,
            "email":data?.email,
            "phone_number":data?.phoneNumber,
            "about":data?.about,
            "thumb":data?.thumb
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
                                    <Container style={{backgroundColor:'transparent'}}>
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
                        
                                        </div>
                                        <hr style={{ width: '100%' }}></hr>
                                        <div className='output'>
                                            {output.length > 0 ?
                                                <>
                                                            <div >
                                                                <Row>{output.map((e, i)=>(
                                                                <Col key={i} md={5} >
                                                                <OrgCard About={e} onClick={getChannels}></OrgCard>
                                                                </Col>
                                                            ))}
                                                            </Row>
                                                            </div>
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


