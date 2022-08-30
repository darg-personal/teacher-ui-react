import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const RegisterScreen = () => {
    const navigate = useNavigate();
    let registrationFields = [
        {
            placeholder: "Name",
            value: "",
            name: "name",
            type: "text",
            hasError: false
        },
        {
            placeholder: "Email",
            value: "",
            name: "email",
            type: "email",
            hasError: false
        },
        {
            placeholder: "Password",
            value: "",
            name: "password",
            type: "password",
            hasError: false
        }
    ]

    const [fields, updateFields] = useState(registrationFields);    
    async function SignUp() {
        let items = [...fields]
        let valu = { "name": items[0].value, "email": items[1].value, 'password': items[2].value }
        await axios.post("http://localhost:8000/s3_uploader/user/register/", valu).then(resp => {
            navigate("/");
        }).catch(resp => {
            alert("try to sign up with another Email or username")
        })
    }


    const updateFieldValue = (value, index) => {
        // setUser({...user,[e.target.name]:e.target.value});
        let fieldItems = [...fields];
        fieldItems[index].value = value;
        fieldItems[index].hasError = value === ''
        updateFields(fieldItems)
        console.log("input value", fieldItems)
    }

    console.log(fields, "===============");
    return <div className={'login-section page-container'}>
        <div className={'auth-container'}>
            <div className={'auth-logo'}>
                <img src={require('../../assets/teacherlogo.png')} alt={'Teacher logo'} />
            </div>
            <div className={'auth-content'}>
                <div className={'auth-header'}>
                    <h4>Sign Up</h4>
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

                    <div className={'signin-section'}>
                        Have an account? <Link to={'/login'}>Log in</Link>
                    </div>
                    <div className={'button-container'}>
                        <button type={'submit'} onClick={SignUp} disabled={fields.filter(field => field.value === '').length > 0}>Sign Up</button>
                    </div>
                </div>
            </div>
        </div>

    </div>
}

export default RegisterScreen
