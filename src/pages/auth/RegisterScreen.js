import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import utils from "./utils";

const RegisterScreen = () => {
    const navigate = useNavigate();
    const [bannerAlert, setBannerAlert] = useState(false);
    const [errorAlert, setErrorAlert] = useState(false);
    let registrationFields = [
        {
            placeholder: "Name",
            value: "",
            name: "name",
            type: "text",
            hasError: false,
        },
        {
            placeholder: "Email",
            value: "",
            name: "email",
            type: "email",
            hasError: false,
        },
        {
            placeholder: "Password",
            value: "",
            name: "password",
            type: "password",
            hasError: false,
        },
    ];

    const [fields, updateFields] = useState(registrationFields);
    const [time, setTime] = useState(5000);


    async function SignUp() {
        let items = [...fields];
        let valu = {
            name: items[0].value,
            email: items[1].value,
            password: items[2].value,
        };
        await axios
            .post(`${utils.getHost()}/profile/user/register/`, valu)
            .then((resp) => {
                setBannerAlert(true);
                setTimeout(() => {
                    navigate("/");
                }, 3000);
            })
            .catch((resp) => {
                console.log("isss called");
                setErrorAlert(true);
            });
    }

    const updateFieldValue = (value, index) => {
        let fieldItems = [...fields];
        fieldItems[index].value = value;
        fieldItems[index].hasError = value === "";
        updateFields(fieldItems);
        setErrorAlert(false);
    };
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
        <div className={"login-section page-container"}>

            <div className={"auth-container"}>
                <div className={"auth-logo"} style={{ alignItems: 'center' }}>
                    <img
                        src={require("../../assets/teacherlogo.png")}
                        alt={"Teacher logo"}
                    />
                </div>
                <div className={"auth-content"}>
                    <div className={"auth-header"}>
                        <h4>Sign Up</h4>
                    </div>
                    <div className={"input-list centered-data"}>
                        {fields.map((field, index) => {
                            return (
                                <div className={`input-control`} key={index}>
                                    <input
                                        type={field.type}
                                        value={field.value}
                                        name={field.name}
                                        onChange={(event) =>
                                            updateFieldValue(event.target.value, index)
                                        }
                                        placeholder={field.placeholder}
                                        className={`${field.hasError ? "input-error" : ""}`}
                                    />
                                </div>
                            );
                        })}
                    </div>
                    <div className={"centered-data"}>
                        <div className={"signin-section"}>
                            Have an account? <Link to={"/login"}>Log in</Link>
                        </div>

                        {bannerAlert &&
                            <div style={successBanner}>
                                <span className="d-flex justify-content-center">
                                    Sign Up successfully !!
                                </span>
                            </div>
                        }
                        {errorAlert &&
                            <div style={errorBanner}>
                                <span className="d-flex justify-content-center">
                                    This email is already exist try another Email !!
                                    <span> &nbsp;&nbsp;&nbsp;&nbsp;x </span>
                                </span>
                            </div>
                        }
                        <div className={"button-container"}>
                            <button
                                type={"submit"}
                                onClick={SignUp}
                                disabled={
                                    fields.filter((field) => field.value === "").length > 0
                                }
                            >
                                Sign Up
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterScreen;
