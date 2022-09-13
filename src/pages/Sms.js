import React from "react";
import { Container, Row } from "react-bootstrap";
import List from "../components/Sms/List";
import { Navigate } from "react-router-dom";

let Token = localStorage.getItem("token");

function Sms() {
  return (
    <>
      {
        Token ? (
          <Container fluid>
            <Row>
              <List />
            </Row>
          </Container>
        ) : (
          <Navigate replace to="/login" />
        )
      }
    </>

  );
}

export default Sms;
