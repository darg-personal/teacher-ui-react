import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Modal from "../../components/AuthModal/Modal";

const RegisterScreen = () => {
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

  const updateFieldValue = (value, index) => {
    let fieldItems = [...fields];
    fieldItems[index].value = value;
    fieldItems[index].hasError = value === "";
    updateFields(fieldItems);
  };

  let url = "http://localhost:8000/s3_uploader/user/register/";
  const handleFormSubmit = (event) => {
    event.preventDefault();
    console.log("Form submitted");

    axios.post(url)
    .then((response)=>{
        console.log(response);
    })
  };

  return (
    <div className={"login-section page-container"}>
      <div className={"auth-container"}>
        <div className={"auth-logo"}>
          <img
            src={require("../../assets/teacherlogo.png")}
            alt={"Teacher logo"}
          />
        </div>

        <div className={"auth-content"}>
          <div className={"auth-header"}>
            <h4>Sign Up</h4>
          </div>
          <form
            method={"post"}
            action={""}
            onSubmit={(event) => {
              handleFormSubmit(event);
            }}
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

              <div className={"button-container"}>
                <button
                  type={"submit"}
                  disabled={
                    fields.filter((field) => field.value === "").length > 0
                  }
                >
                  Sign Up
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterScreen;
