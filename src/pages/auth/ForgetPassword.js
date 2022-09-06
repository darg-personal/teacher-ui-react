import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import utils from "./utils";

const RegisterScreen = () => {
    const navigate = useNavigate();
    let registrationFields = [
     
        {
            placeholder: "Email",
            value: "",
            name: "email",
            type: "email",
            hasError: false
        },
   
    ]
    const updateFieldValue = (value, index) => {
        // setUser({...user,[e.target.name]:e.target.value});
        let fieldItems = [...fields];
        fieldItems[index].value = value;
        fieldItems[index].hasError = value === ''
        updateFields(fieldItems)
        // console.log("input value", fieldItems,"*****************************")
    }

    const [fields, updateFields] = useState(registrationFields);    
    async function Reset() {
        let items = [...fields]
        let valu =  {"email": items[0].value}
        // console.log(valu,"+++++++++++++++++++++++++++++++");
        await axios.post(`${utils.getHost()}/s3_uploader/user/password_reset/`, valu).then(resp => {
            navigate("/");
        }).catch(resp => {
            alert("try to reset another Email")
        })
    }



    console.log(fields, "===============");
    return <div className={'login-section page-container'}>
        <div className={'auth-container'}>
            <div className={'auth-logo'}>
                <img src={require('../../assets/teacherlogo.png')} alt={'Teacher logo'} />
            </div>
            <div className={'auth-content'}>
                <div className={'auth-header'}>
                    <h4>Reset Password</h4>
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
                        <button type={'submit'} onClick={Reset}>Reset Password</button>
                    </div>
                </div>
            </div>
        </div>

    </div>
}

export default RegisterScreen
