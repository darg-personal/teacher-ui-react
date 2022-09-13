import React from 'react'
import Sidebar from '../../pages/auth/Sidebar';
import Header from '../../pages/auth/Header';
import Dashboard from '../../pages/auth/Dashboard';
// import "../../css/auth/Dashboard.scss";
import "../../css/student/student_dashboard.scss"
import { Navigate } from "react-router-dom";

let Token = localStorage.getItem("token");



export default function Student_Dashboard() {
  return (
    <>
      {
        Token ? (
          <div className="dashboard-wrapper">
            <Sidebar />
            <div className="header-main">
              <Header />

              <div className="container-fluid p-0">
                <div className="row" id="body-row">
                  <div id="left-sidebar"></div>
                  <div className="col p-0 content-div">
                    <div id="page-header"></div>
                    <div className="container">
                      <div className="row dashboard_title">
                        <div className="col-xl-8 col-sm-6 mb-8">
                          <h2>
                            <b className="">Dashboard</b>
                          </h2>
                        </div>
                      </div>

                      <div className="row student_cards">

                        <div className="col-xl-3 col-sm-6 mb-3">
                          <div className="card text-white bg-success o-hidden">
                            <div className="card-body card-add-student">
                              <div className="card-body-icon">
                                <i className="fa fa-graduation-cap"></i>
                              </div>
                              <h5 className="analyticTitle">Add Student</h5>

                            </div>
                          </div>
                        </div>

                        <div className="col-xl-3 col-sm-6 mb-3">

                          <div className="card text-white bg-info o-hidden">
                            <div className="card-body card-add-className">
                              <div className="card-body-icon">
                                <i className="fa fa-users"></i>
                              </div>
                              <h5 className="analyticTitle">Add className</h5>
                            </div>
                          </div>
                        </div>

                        <div className="col-xl-3 col-sm-6 mb-3">
                          <div className="card text-white bg-lesson o-hidden">
                            <div className="card-body" id="lesson-card-body">
                              <div className="card-body-icon">
                                <i className="fa fa-book"></i>
                              </div>
                              <h5 className="analyticTitle">Lessons</h5>
                            </div>
                          </div>
                        </div>

                      </div>

                      <div id="customChart" className="row chartRow">

                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        ) : (
          <Navigate replace to="/login" />

        )
      }
    </>

  )
}
