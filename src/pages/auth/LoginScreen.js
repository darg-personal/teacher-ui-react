import React, {useState} from "react";
import "../../css/auth/auth.scss";
import {Link} from "react-router-dom";
import Modal from "../../components/AuthModal/Modal";
const LoginScreen = () => {
    let loginFields = [
        {
            placeholder: "Email address or username",
            value: "",
            name: "username",
            type: "text",
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

    const [fields, updateFields] = useState(loginFields);

    const setFieldValue = (value, index) => {
        let fieldData = [...fields];
        fieldData[index].value = value;
        fieldData[index].hasError = value === ''
        updateFields(fieldData)
    }

    return <div className={'login-section page-container'}>
            <div className={'auth-container'}>
                <div className={'auth-logo'}>
                    <img src={require('../../assets/teacherlogo.png')} alt={'Teacher logo'}/>
                </div>

                <div className={'auth-content'}>
                    <div className={'auth-header'}>
                        <h4>Login</h4>
                        <div className={'header-text'}>
                            Don't have an account yet? <Link to={'/register'}>Sign Up</Link>
                        </div>
                    </div>

                    <div className={'input-list centered-data'}>
                        {
                            fields.map((field, index) => {
                                return <div className={`input-control`} key={index}>
                                    <input
                                        type={field.type}
                                        value={field.value}
                                        name={field.name}
                                        onChange={event => setFieldValue(event.target.value, index)}
                                        placeholder={field.placeholder}
                                        className={`${field.hasError ? 'input-error': ''}`}
                                    />
                                </div>
                            })
                        }
                    </div>

                    <div className={'centered-data'}>

                        <div className={'forgot-password-section'}>
                            <Link to={'/'}>Forgot password?</Link>
                        </div>

                        <div className={'button-container'}>
                            <button type={'submit'} disabled={fields.filter(field => field.value === '').length > 0}>Log in</button>
                        </div>
                    </div>


                </div>
            </div>
        <Modal text={'Signing in!'} closable={true}/>
    </div>
}

export default LoginScreen
