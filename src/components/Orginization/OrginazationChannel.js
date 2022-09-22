import { React, useState } from "react";
import axios from "axios";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { Link, Navigate, Outlet } from "react-router-dom";
import utils from "../../pages/auth/utils";
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Avatar, Button, ListItemAvatar } from "@mui/material";
import { Card, Container } from "react-bootstrap";
import Sidebar from "../../pages/auth/Sidebar";
import Header from "../../pages/auth/Header";
import { ImageShow, ImgUpload } from "../ChatRoom/templates/MainChat/Chat";
import CancelSharpIcon from "@mui/icons-material/CancelSharp";
import UserRequest from "./channelPage";
let Token = localStorage.getItem("token");
let loggedUser = JSON.parse(localStorage.getItem("user"));

function OrgChannel(props) {
    const orgId = props.orgId
    const orgName = props.orgName

    const [users, setUsers] = useState([]);
    const [channelId, setChannelId] = useState(null);
    const [channelName, setChannelName] = useState(null);
    const [orgData, setOrgData] = useState({ orgId: null, channelId: null,orgName:null, channelName : null });


    const [showAddChannelPage, setShowAddChannelPage] = useState(false);
    const [requestPageVisible, setRequestPageVisible] = useState(false);

    async function getChannels() {
        await axios
            .get(`${utils.getHost()}/chat/get/channel`, {
                headers: {
                    Authorization: `Bearer ${Token}`,
                },
            })
            .then((response) => {
                const responseData = JSON.stringify(response.data);
                const value = JSON.parse(responseData);
                let data = []
                for (let i = 0; i < value.length; i++) {
                    // if (value[i].org === orgId)
                    data.push({ 'orgId': value[i].org, 'name': value[i].name, 'profile': value[i].image, requested: false, 'channelId': value[i].id })

                }
                setUsers(data);
            });
    }

    useEffect(() => {
        getChannels();
    }, []);

    const updateShow = () => {
        props.back({ show: false })
    }

    const navigateToRequestPage = (data) => {
        setChannelId(data.channelId);
        setChannelName(data.name)
        
        setRequestPageVisible(true)
    }

    function Channels() {
        return <>
            <div style={{
                margin: 0,
                padding: 0,
                width: '25%',
                overflow: 'auto',
            }}>

                {users.length > 0 ?
                    <>
                        {users.map((e, i) => (
                            <div key={i}>
                                <div style={{
                                    background: 'darkblue', height: 'auto',
                                    marginLeft: '10px',
                                    color: "white", padding: '5px', borderRadius: '10px'
                                }}
                                >
                                    <ListItemAvatar style={{ display: 'flex' }}>
                                        <Avatar alt={e.name} src={e.profile} style={{
                                            alignItems: 'center',
                                            margin: '5px',
                                            height: '35px',
                                            width: '35px'
                                        }} />
                                        <p style={{ float: 'right', justifyContent: 'center', margin: '10px 10px' }}>{e.name}</p>
                                    </ListItemAvatar>
                                    <p style={{ justifyContent: 'center', margin: '10px 55px' }}>About Section</p>
                                    {!e.requested ?

                                        <Button style={{
                                            float: 'right', justifyContent: 'center',
                                            margin: '-60px 10px'
                                        }}
                                            onClick={() => {
                                                navigateToRequestPage(e)
                                            }}
                                        > {'show >'} </Button>
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
                                updateShow()
                            }}>Back </Button>
                            <Card >
                                <p style={{ fontSize: '25px', fontFamily: 'bold', alignSelf: 'center' }}> {orgName}</p>
                            </Card>
                            <p className="button-upload-org" style={{ float: 'right' }}
                                onClick={() => setShowAddChannelPage(true)}>Add New Channel</p>

                            <p className="button-upload-org" style={{ float: 'left' }}
                                onClick={() => getChannels()}>Refresh</p>
                            <hr style={{ width: '100%' }}></hr>

                        </Container>
                        <div style={{ display: 'flex' }}>
                            <Channels />

                            {requestPageVisible ?
                                <UserRequest channelId={channelId}
                                 channelName={channelName}
                                  orgId={orgId} 
                                  orgName={orgName}  />
                                : null}
                        </div>
                    </>

                    :
                    <CreateChannelPage goBack={updateShow} />
                }
            </div>
        </>
    )
}
export default OrgChannel;


export const CreateChannelPage = (props) => {
    let channelNameFields = [
        {
            placeholder: "Channel Name",
            value: "",
            name: "name",
            type: "text",
            hasError: false
        },
    ]

    const [fields, updateFields] = useState(channelNameFields);
    const [Org, setOrg] = useState(channelNameFields);
    const [Orginizations, setOrginizations] = useState([]);
    const [state, setState] = useState({
        file: "",
        filePreviewUrl:
            require('../../assets/teacherlogo.png'),
    });

    async function CreateChannel() {
        let items = [...fields]
        let formData = new FormData();
        formData.append("name", items[0].value);
        formData.append("org", Org);
        formData.append("image", state.file);

        if (state.file) {
            await axios.post(`${utils.getHost()}/chat/get/channel`, formData,
                {
                    headers: {
                        Authorization:
                            `Bearer ${Token}`,
                    }
                }).then(data => {
                    alert("!!! Channel Created");
                    setTimeout(() => {
                        props.goBack()
                    }, 5000);
                }).catch(resp => {
                    alert("NetWork Error....", resp)
                })
        }
        else {
            alert('Please Upload custom Profile')
        }
    }

    async function GetOrginizations() {
        await axios.get(`${utils.getHost()}/chat/get/org`,
            {
                headers: {
                    Authorization:
                        `Bearer ${Token}`,
                }
            }
        ).then(data => {
            const alldata = data?.data;
            const tempstore = []
            for (let i = 0; i < alldata.length; i++) {
                if (alldata[i].user.id === loggedUser.id)
                    tempstore.push({ org: alldata[i].meta_attributes, orgId: alldata[i].id })
            }
            setOrginizations(tempstore)
            setOrg(tempstore[0].orgId)
        }).catch(resp => {
            alert("Indeed no Org")
        })
    }

    useEffect(() => {
        GetOrginizations()
    }, [])


    const updateFieldValue = (value, index) => {
        // setUser({...user,[e.target.name]:e.target.value});
        let fieldItems = [...fields];
        fieldItems[index].value = value;
        fieldItems[index].hasError = value === ''
        updateFields(fieldItems)
    }
    const setval = (data) => {
        setOrg(data.target.value)
    }


    const photoUpload = (event) => {
        event.preventDefault();
        const reader = new FileReader();
        const file = event.target.files[0];
        reader.onloadend = () => {
            setState({
                file: file,
                filePreviewUrl: reader.result,
            });
        };
        reader.readAsDataURL(file);
    };

    return <div className={'login-section page-container'}>
        <div className={'auth-container'}>
            <Button onClick={() => {
                props.goBack()
            }}>Back </Button>

            <div className={'auth-content'}>
                <div className={'auth-header'}>
                    <h4> Create Channnel</h4>
                </div>
                <div className={'input-list centered-data'}>
                    <div className="input-control">
                        <p>Select Orginization</p>
                        <select value={Org} className="input-control" onChange={setval}>
                            {Orginizations.map((orginization) => (
                                <option value={orginization.orgId} >{orginization.org}</option>
                            ))}
                        </select>
                    </div>
                    <p>Channel Name</p>
                    {
                        fields.map((field, index) => {
                            return <div className={`input-control`} key={index}>
                                <input
                                    type={field.type}
                                    value={field.value}
                                    name={field.name}
                                    onChange={event => updateFieldValue(event.target.value, index)}
                                    placeholder={field.placeholder}
                                    className={`${field.hasError ? 'input-error' : ''}`}
                                />
                            </div>
                        })
                    }
                </div>
                <div style={{ width: state.file ? '80%' : '60%', marginLeft: state.file ? '10%' : '20%' }}>
                    {state.file ? (
                        <CancelSharpIcon
                            style={{ float: 'right', padding: '5px' }}
                            onClick={() => {
                                setState({
                                    file: null,
                                    filePreviewUrl: require('../../assets/teacherlogo.png'),
                                });
                            }}
                            color="primary"
                            fontSize="large"
                        />
                    ) : (
                        null)}
                    <ImageShow filePreviewUrl={state.filePreviewUrl} />
                    <div style={{ float: 'right' }}>
                        <ImgUpload onChange={photoUpload} />
                    </div>
                </div>
                <div className={'centered-data'}>

                    <div className={'button-container'}>
                        <button type={'submit'} onClick={CreateChannel} disabled={fields.filter(field => field.value === '').length > 0}>Add Channel</button>
                    </div>
                </div>
            </div>
        </div>

    </div>
}

