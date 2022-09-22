import React, { Component, useState } from "react";
import { Dropdown } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
import "../../css/auth/Dashboard.scss";
import Dashboard from "./Dashboard";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import utils from "./utils";

const Header = () => {
  let navigate = useNavigate();
  let Token = localStorage.getItem("token");
  const profileSrc = localStorage.getItem("loginUserImage")
  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleChangePassword = () => {
    navigate("/changepassword");
  };
  return (
    // <div className="header-main">
    <div className="action-wrap">
      <Dropdown>
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          {profileSrc ? (
            <img
              src={profileSrc}
              height={24}
              width={24}
              style={{ borderRadius: 12, marginRight: 5 }}
            />
          ) : (
            <FaUserCircle />
          )}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item onClick={() => navigate("/userprofile")}>
            Settings
          </Dropdown.Item>

          <Dropdown.Item
            onClick={() => {
              handleChangePassword();
            }}
          >
            Change Password
          </Dropdown.Item>
          <Dropdown.Item href="#/action-2">Activity Log</Dropdown.Item>
          <Dropdown.Item href="#/action-3">Messages</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item eventKey="4" onClickCapture={logout}>
            Logout
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
    //   {/* <Dashboard /> */}
    // // </div>
  );
};

export default Header;
