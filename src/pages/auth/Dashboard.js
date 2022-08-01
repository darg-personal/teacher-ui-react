import React, { Component } from "react";
import { Pagination } from "react-bootstrap";

class Dashboard extends Component {
  render() {
    return (
      <div className="container">
        <div className="student-wrap">
          <h1>Student Dashboard</h1>
          <p>Welcome back !</p>
          <Pagination>
            <Pagination.Item disabled>Previous</Pagination.Item>
            <Pagination.Item active>{1}</Pagination.Item>
            <Pagination.Item>{2}</Pagination.Item>
            <Pagination.Item>{3}</Pagination.Item>
            <Pagination.Item>Next</Pagination.Item>
          </Pagination>
        </div>
      </div>
    );
  }
}

export default Dashboard;
