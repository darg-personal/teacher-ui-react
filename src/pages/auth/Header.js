import React, { Component } from "react";
import { Dropdown } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
import "../../css/auth/Dashboard.scss";
import Dashboard from "./Dashboard";
import { useNavigate } from "react-router-dom";

const Header = () => {
  let navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };
  return (
    // <div className="header-main">
      <div className="action-wrap">
        <Dropdown>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            <FaUserCircle />
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item href="#/action-1">Settings</Dropdown.Item>
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
