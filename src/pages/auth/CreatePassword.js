import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import utils from "./utils";


let Token = localStorage.getItem("token");
let current_token = window.location.href.slice(43)
const CreatePassword = () => {
    const navigate = useNavigate();
    let registrationFields = [

        {
            placeholder: "New Password",
            value: "",
            name: "Password",
            required: "required",
            type: "Password",
            hasError: false
        },
        {
            placeholder: "Re-type password",
            value: "",
            name: "Password",
            required: "required",
            type: "Password",
            hasError: false
        },

    ]

    const updateFieldValue = (value, index) => {
        let fieldItems = [...fields];
        fieldItems[index].value = value;
        fieldItems[index].hasError = value === ''
        updateFields(fieldItems)

    }

    const [fields, updateFields] = useState(registrationFields);
    async function CreatePass() {
        let items = [...fields]
        let valu = { "password": items[0].value, "token": current_token }
        if (items[0].value === items[1].value) {
            axios.post(`${utils.getHost()}/profile/user/password_reset/confirm/`, valu).then(resp => {
                navigate("/login");
            }).then(() => {
                navigate("/login")
            }).catch((err) => {
                alert("Enter long password With character and numerical value and check your Re-type password")
            })
        } else
            alert("Password does not match")
    }

    return <div className={'login-section page-container'}>
        <div className={'auth-container'}>
            <div className={'auth-logo'}>
                <img src={require('../../assets/teacherlogo.png')} alt={'Teacher logo'} />
            </div>
            <div className={'auth-content'}>
                <div className={'auth-header'}>
                    <h4>Create New Password</h4>
                </div>
                <div className={'input-list centered-data'}>
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
                <div className={'centered-data'}>


                    <div className={'button-container'}>
                        <button type={'submit'} onClick={CreatePass}>Submit</button>
                    </div>
                </div>
            </div>
        </div>

    </div>
}

export default CreatePassword;