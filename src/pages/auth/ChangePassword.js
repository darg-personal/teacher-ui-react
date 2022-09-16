import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import utils from "./utils";
import { useNavigate } from "react-router-dom";

let Token = localStorage.getItem("token");

const ChangePassword = () => {
  const navigate = useNavigate();
  let changePasswordFields = [
    {
      placeholder: " Old Password ",
      value: "",
      name: "Old Password",
      required: "required",
      type: "Password",
      hasError: false,
    },
    {
      placeholder: "New Password",
      value: "",
      name: "New password",
      required: "required",
      type: "password",
      hasError: false,
    },
  ];

  const [fields, updateFields] = useState(changePasswordFields);
  const [isSelected, setIsSelected] = useState(false);

  //  axios
  //   .post("http://localhost:8000/profile/user/change-password", valu)
  //   .then((resp) => {
  //     navigate("/");
  //   })
  //   .catch((resp) => {
  //     alert("try to change");
  //   });

  const updateFieldValue = (value, index) => {
    // setUser({...user,[e.target.name]:e.target.value});
    let fieldItems = [...fields];
    fieldItems[index].value = value;
    fieldItems[index].hasError = value === "";
    updateFields(fieldItems);
    console.log("input value", fieldItems);
    if (fieldItems[1].value.length > 4 && fieldItems[0].value.length > 4)
      setIsSelected(true);
    else setIsSelected(false);
  };

  const changePass = () => {
    let items = [...fields];
    let valu = {
      old_password: items[0].value,
      new_password: items[1].value,
    };

    // console.log("---====", valu);
    axios
      .put(`${utils.getHost()}/profile/user/change-password`, valu, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      })
      .then((resp) => {
        navigate("/dashboard");
      })
      .catch((err) => {
        alert(" old password is wrong ", err);
      });
  };
  // console.log(fields, "===============");
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
            <h4>Change Password</h4>
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
            {/* <div className={"button-container"}> */}
            {isSelected ? (
              <p
                type="click"
                className="button-upload"
                onClick={(data) => {
                  changePass();
                }}
              >
                Save{" "}
              </p>
            ) : (
              <p
                type="click"
                className="button-upload"
                onClick={(data) => {
                  navigate("/dashboard");
                }}
                style={{ background: "#00A300" }}
              >
                GoBack{" "}
              </p>
            )}
            {/* </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
