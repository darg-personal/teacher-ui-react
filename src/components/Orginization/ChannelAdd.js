import { React, useState } from "react";
import axios from "axios";
import utils from "../../pages/auth/utils";
import { useEffect } from "react";
import { Button } from "@mui/material";
import { ImageShow, ImgUpload } from "../ChatRoom/templates/MainChat/Chat";
import CancelSharpIcon from "@mui/icons-material/CancelSharp";

export const CreateChannelPage = (props) => {
    let Token = localStorage.getItem("token");
    let loggedUser = JSON.parse(localStorage.getItem("user"));

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
                    let value = data?.data?.msg
                    let valu = { Channel: value.id, designation: 0, user: value.created_by, org: value.org };
                    axios
                        .post(
                            `${utils.getHost()}/chat/get/channelmember`,
                            valu,
                            {
                                headers: {
                                    Authorization: `Bearer ${Token}`,
                                },
                            }
                        )
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
            alert("Indeed No Org")
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
                        <button type={'submit'} onClick={CreateChannel}
                            disabled={fields.filter(field => field.value === '').length > 0}>
                            Add Channel</button>
                    </div>
                </div>
            </div>
        </div>

    </div>
}
