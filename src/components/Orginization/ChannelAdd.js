import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@mui/material";
import { useDropzone } from 'react-dropzone'
import CancelSharpIcon from "@mui/icons-material/CancelSharp";
import utils from "../../pages/auth/utils";
import { ImageShow } from "../ChatRoom/templates/MainChat/Chat";
// 'https://s3.us-west-1.amazonaws.com/sfappv2.1/Test/upload/b7d4e1bf-8de6-4412-9dcc-736d8da0c944.jpg'
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
        {
            placeholder: "about",
            value: "",
            About: "about",
            type: "text",
            hasError: false
        },
    ]

    const [alert, setAlert] = useState();
    const [fields, updateFields] = useState(channelNameFields);
    const [Org, setOrg] = useState(props.orgId);
    const [Orginizations, setOrginizations] = useState([]);
    const [selectedFile, setSelectedFile] = useState();
    const [isSelected, setIsSelected] = useState(false);
    const [state, setState] = useState({
        file: "",
        filePreviewUrl: ''
    });

    async function CreateChannel(event) {
        setErrorAlert(false)
        setSuccessAlert(false)
        event.preventDefault();
        let items = [...fields]
        // let formData = new FormData();
        // formData.append("name", items[0].value);
        // formData.append("org", Org);
        // formData.append("about", items[1].value);
        // formData.append("image", file_url);


        let file_url;
        if (isSelected) {
            let formImage = new FormData();
            formImage.append("file", selectedFile);
            await axios
                .post(`${utils.getHost()}/profile/upload`, formImage)
                .then((resp) => {
                    file_url = resp.data.file_url;
                })
                .then(() => {
                    setIsSelected(false)
                })
                .catch((error) => {
                    setState({ file: false });
                    alert("connection is breaked", error);
                });
        } else {
            file_url = null;
        }

        let formData = {
            "name": items[0].value,
            "org": Org,
            "about": items[1].value,
            "image": file_url ? file_url : null
        };

        await axios.post(`${utils.getHost()}/chat/get/channel`, formData,
            {
                headers: {
                    Authorization:
                        `Bearer ${Token}`,
                }
            }).then(data => {
                let value = data?.data?.msg
                let valu = {
                    Channel: value.id, designation: 0,
                    user: value.created_by,
                    org: value.org,
                    about: value.about,
                };
                axios
                    .post(
                        `${utils.getHost()}/chat/get/channelmember`,
                        valu,
                        {
                            headers: {
                                Authorization: `Bearer ${Token}`,
                            },
                        }
                    ).then((resp) => {
                        let temp = resp?.data?.msg;
                        setSuccessAlert(true)
                        setTimeout(() => {
                            props.channelCreated({
                                channeName: items[0].value, channelThumb: file_url,
                                channelId: temp.id,
                                orgId: temp.org, isExist: 0
                            })
                        }, 5000);
                    })
            }).catch(resp => {
                setErrorAlert(true)
                console.log(resp?.message);
                setAlert(resp?.message + '\t Try with another Name')
            })

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
    const { getRootProps, getInputProps } = useDropzone({
        accept: 'image/*',
        onDrop: (event) => {
            setSelectedFile(event[0]);
            setIsSelected(true);
            let props = event.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file)
            }))
            setState({
                file: event[0],
                filePreviewUrl: props[0].preview,
            });
        }
    });
    const [successAlert, setSuccessAlert] = useState(false);
    const [errorAlert, setErrorAlert] = useState(false);
    const successBanner = {
        color: "#fff",
        backgroundColor: "green",
        borderRadius: 2, padding: '1%',
        justifyContent: 'center'
    };
    const errorBanner = {
        color: "#fff",
        backgroundColor: "red",
        borderRadius: 2, padding: '1%',
        justifyContent: 'center'
    }
    return (
        <>
            <div className={"centered-data"}>
                {successAlert &&
                    <div style={successBanner}>
                        <span className="d-flex justify-content-center">
                            {`${fields[0].value} is Created Successfully`}
                        </span>
                    </div>
                }
                {errorAlert &&
                    <div style={errorBanner}>
                        <span className="d-flex justify-content-center">
                            {`${alert}`}
                            <span > &nbsp;&nbsp;&nbsp;&nbsp;x </span>
                        </span>
                    </div>
                }
            </div>
            <div className={'login-section page-container'}>

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
                            {
                                fields.map((field, index) => {
                                    return <div key={index}>
                                        <p>{field.placeholder}</p>
                                        <div className={`input-control`} key={index}>
                                            <input
                                                type={field.type}
                                                value={field.value}
                                                name={field.name}
                                                onChange={event => updateFieldValue(event.target.value, index)}
                                                placeholder={field.placeholder}
                                                className={`${field.hasError ? 'input-error' : ''}`}
                                            />
                                        </div>
                                    </div>
                                })
                            }
                        </div>
                        <div >
                            {state.file ? (
                                <CancelSharpIcon
                                    style={{ float: 'right', padding: '5px' }}
                                    onClick={() => {
                                        setState({
                                            file: null,
                                        });
                                    }}
                                    color="primary"
                                    fontSize="large"
                                />
                            ) : (
                                null)}
                            <div style={{
                                margin: "0px 100px",
                                position: 'relative',
                                top: '50px',
                                justifyContent: "center",
                                cursor: "pointer",
                                height: "150px",
                                width: "50%",
                                borderRadius: "5px",
                                backgroundColor: '#D2F1EF'
                            }} {...getRootProps()} >
                                {state.filePreviewUrl &&
                                    <ImageShow filePreviewUrl={state.filePreviewUrl} />}
                                <input {...getInputProps()} />
                                {!state.filePreviewUrl &&
                                    <p style={{
                                        textAlign:'center',
                                        paddingTop:'60px'
                                    }} >{`Drag or click to select files`}</p>
                                }
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
        </>
    )
}
