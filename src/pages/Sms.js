import React from "react";
import { Container, Row } from "react-bootstrap";
import List from "../components/Sms/List";

function Sms() {
  return (
    <Container fluid>
      <Row>
        <List />
      </Row>
    </Container>
  );
}

export default Sms;
