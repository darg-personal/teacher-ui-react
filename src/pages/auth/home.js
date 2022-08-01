import React, { Component } from "react";
import "../../css/auth/Dashboard.scss";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { Navigate } from "react-router-dom";
import Dashboard from "./Dashboard";

class home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addClass: false,
      isLogin: localStorage.getItem("token") ? true : false,
    };
  }

   handleClick = () =>{
    console.log('click');
    this.setState(() => ({
      addClass: true,
    }));
  }

  render() {  
    return (
       
      <div
        className={
          this.state.addClass
            ? "menu-open dashboard-wrapper"
            : "dashboard-wrapper"
        }
      >
        {this.state.isLogin ? (
          <>
            <Sidebar />
            <div className="header-main">
            <Header />
            <Dashboard />
            </div>
          </>
        ) : (
          <>
            <Navigate replace to="/login" />
          </>
        )}
      </div>
    

    );
  }
}

export default home;
