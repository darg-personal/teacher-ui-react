import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import Header from "../../pages/auth/Header";
import Sidebar from "../../pages/auth/Sidebar";
import InputGroup from "react-bootstrap/InputGroup";
import {
  Button,
  Col,
  Container,
  Form,
  FormControl,
  Modal,
  Row,
  Table,
} from "react-bootstrap";
import "../../css/room/add_class.scss";

export default function Add_class() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <div>
      <div className="dashboard-wrapper">
        <Sidebar />
        <div className="header-main">
          <Header />
          <Container>
            <div className="add_class">
              <div className="class">
                <h1>List of classes</h1>
                <div>
                  <Button onClick={handleShow}>
                    <FaPlus />
                    Add
                  </Button>
                  <Modal
                    className="stu_modal"
                    show={show}
                    onHide={handleClose}
                    backdrop="static"
                    keyboard={false}
                  >
                    <Modal.Header closeButton>
                      <Modal.Title>
                        <h5>Add Class</h5>
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <Container>
                        <div className="form">
                          <Row>
                            <Col xs={12}>
                              <Form.Group
                                className="mb-3"
                                controlId="formBasicEmail"
                              >
                                <div className="leble_two">
                                  <Form.Label>Class Name</Form.Label>
                                  <Form>
                                    {["checkbox"].map((type) => (
                                      <div
                                        key={`default-${type}`}
                                        className="mb-3"
                                      >
                                        <Form.Check
                                          type={type}
                                          id={`default-${type}`}
                                          label={` Make Class Public`}
                                        />
                                      </div>
                                    ))}
                                  </Form>

                                </div>
                                <Form.Control
                                  type="email"
                                  placeholder="Class Name"
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                          <div className="submit">
                            <Button>Submit</Button>
                          </div>
                        </div>
                      </Container>
                    </Modal.Body>
                  </Modal>
                </div>
              </div>
              <div className="stu_table">
                <Table striped bordered>
                  <thead>
                    <tr>
                      <th>Class Id</th>
                      <th>Class Name</th>
                      <th>Edit</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>Mark</td>
                      <td>Otto</td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td>Jacob</td>
                      <td>Thornton</td>
                    </tr>
                    <tr>
                      <td>3</td>
                      <td>Larry the Bird</td>
                      <td>@twitter</td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </div>
          </Container>
        </div>
      </div>
    </div>
  );
}
