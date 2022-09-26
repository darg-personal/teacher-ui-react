import utils from "../../pages/auth/utils";
import React, { useState } from 'react'
import axios from "axios";
import "./orginization.css";
import "../../css/auth/auth.scss";
import "./addorg.css";

import { Button } from "react-bootstrap";


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
                const org = response.data.data;
                if (response.status == 203)
                    alert(`Orginization Name. ${response?.data?.error?.meta_attributes}`)
                if (response.status == 201)
                    props.updateNewOrginization({
                        meta_attributes: org.meta_attributes,
                        orgId: org.id,
                        user: org.user,
                        created_at: org.created_at
                    })
            })
            .catch((error) => {

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