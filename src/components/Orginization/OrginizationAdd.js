import utils from "../../pages/auth/utils";
import React, { useState } from 'react'
import axios from "axios";
import "./orginization.css";
import "../../css/auth/auth.scss";
import "./addorg.css";
import { ImageShow } from "../ChatRoom/templates/MainChat/Chat";
import { ImgUpload } from "../ChatRoom/templates/MainChat/Chat";

import { Button } from "react-bootstrap";


export const AddOrg = (props) => {
    let Token = localStorage.getItem("token");
    let loginFields = [
        {
            placeholder: "Orginization name",
            value: "",
            name: "Name",
            type: "text",
            hasError: false,
        },
        {
            name: "Address",
            placeholder: "Orginization address",
            value: "",
            type: "text",
            hasError: false,
        },
        {
            name: "Phone Number",
            placeholder: "Orginization Phone No. ",
            value: "",
            type: "tel",
            hasError: false,
        },

        {
            name: "About",
            placeholder: "About orginization ",
            value: "",
            type: "text",
            hasError: false,
        },
        {
            name: "Email",
            placeholder: "Orginization Email-Id",
            value: "",
            type: "email",
            hasError: false,
        },
    ];


    const [fields, updateFields] = useState(loginFields);
    const [selectedFile, setSelectedFile] = useState();
    const [isSelected, setIsSelected] = useState(false);
    const [state, setState] = useState({
        file: "",
        filePreviewUrl:
            'https://s3.us-west-1.amazonaws.com/sfappv2.1/Test/upload/b7d4e1bf-8de6-4412-9dcc-736d8da0c944.jpg'
    });

    const setFieldValue = (value, index) => {
        let fieldData = [...fields];
        fieldData[index].value = value;
        fieldData[index].address = value;
        fieldData[index].phoneNumber = value;
        fieldData[index].about = value;
        fieldData[index].email = value;
      
        fieldData[index].hasError = value === "";
        updateFields(fieldData);
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();
        let requestObject = {};
        fields.forEach((field) => {
            requestObject[field.name] = field.value;
            requestObject[field.address] = field.value;
            requestObject[field.phoneNumber] = field.value;
            requestObject[field.about] = field.value;
            requestObject[field.email] = field.value;

        });
    };


    async function addorg(event) {
        event.preventDefault();
        let file_url;
        if (isSelected) {
            let formImage = new FormData();
            console.log(formImage)
            formImage.append("file", selectedFile);
            await axios
                .post(`${utils.getHost()}/profile/upload`, formImage)
                .then((resp) => {
                    file_url = resp.data.file_url;
                    console.log({ resp })

                })
                .then(() => {
                    setState({ file: false });
                })
                .catch((error) => {
                    setState({ file: false });

                    alert("connection is breaked",error);
                });
        } else {
            file_url = null;
        }
        let items = [...fields];
        let valu = {
            meta_attributes: items[0].value,
            address: items[1].value,
            about: items[2].value,
            phoneNumber: items[2].value,
            about: items[3].value,
            email: items[4].value,
            image: file_url ? file_url : state.filePreviewUrl
        };
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
                const org = response.data.data;
                if (response.status == 203)
                    alert(`Orginization Name. ${response?.data?.error?.meta_attributes}`)
                if (response.status == 201)
                    props.updateNewOrginization({
                        meta_attributes: org.meta_attributes,
                        orgId: org.id,
                        user: org.user,
                        created_at: org.created_at,
                        address: org.address,
                        phoneNumber: org.phoneNumber,
                        about: org.about,
                        email: org.email,
                    })
            })
            .catch((error) => {

            });
    }
    const photoUpload = (event) => {
        event.preventDefault();
        const reader = new FileReader();
        const file = event.target.files[0];
        console.log(file);
        setSelectedFile(event.target.files[0]);
        setIsSelected(true);
        reader.onloadend = () => {
            setState({
                file: file,
                filePreviewUrl: reader.result,
            });
        };

        console.log(file, reader.result);
        reader.readAsDataURL(file);
    };
    return (
        <>

            <div
                className={"login-section page-container"}
                style={{ display: "flex", padding: "0px" }}
            >
                <div className={"auth-container"}>
                    <Button onClick={() => {
                        props.goBack()
                    }}>
                        <span>&#8592;</span>Back </Button>
                    <div className={"auth-content"}>
                        <div className={"auth-header"}>
                            <h4>Add Orginization</h4>
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
                                        <div className={`input-control`} >
                                            {field.name}
                                            <input
                                                type={field.type}
                                                value={field.value}
                                                name={field.name}
                                                About={field.About}
                                                Address={field.Address}
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
                            <ImageShow filePreviewUrl={state.filePreviewUrl} />

                            <div style={{ float: 'right' }}>
                                <ImgUpload onChange={photoUpload} />
                            </div>
                            <div>
                                <div className={"button-container "} style={{ marginTop: '20%' }}>
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