import React, { useState } from 'react'
import { Button, Col, Container, Form, Modal, Row, Table } from 'react-bootstrap'
import Header from '../../pages/auth/Header'
import Sidebar from '../../pages/auth/Sidebar'
import leades from "../../css/User/leades.scss"
import { Navigate } from "react-router-dom";

let Token = localStorage.getItem("token");



export default function Leads() {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return (
        <>
            {
                Token ? (
                    <div>
                        <div className="dashboard-wrapper">
                            <Sidebar />
                            <div className="header-main">
                                <Header />
                                <Container>
                                    <div className='user_leads'>
                                        <div className='userlead'>
                                            <Container>
                                                <Row className='align-items-center'>
                                                    <Col lg={6}>
                                                        <h2>User leads</h2>
                                                    </Col>
                                                    <Col lg={6}>
                                                        <div className='adddocument'>
                                                            <Button>ADD</Button>
                                                            <Button variant="primary" onClick={handleShow}>
                                                                Import csv
                                                            </Button>
                                                            <Modal show={show} onHide={handleClose}>
                                                                <Modal.Header closeButton>
                                                                    <Modal.Title><h5>upload a csv file</h5></Modal.Title>
                                                                </Modal.Header>
                                                                <Modal.Body>
                                                                    <div className='csvformat'>
                                                                        <Button>Download csv format</Button>
                                                                    </div>
                                                                    <div className='choosefile'>
                                                                        <label>choose csv file</label>
                                                                        <input type="file" />
                                                                    </div>
                                                                    <hr></hr>
                                                                    <div className='upload'>
                                                                        <Button>Upload</Button>
                                                                    </div>
                                                                </Modal.Body>
                                                            </Modal>
                                                            <Button>Delete</Button>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </Container>
                                        </div>
                                        <div className='user_data_table'>
                                            <div className='searchdata'>
                                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                                    <Form.Control type="email" placeholder="Search" />
                                                </Form.Group>
                                            </div>
                                            <div className='userleads_datatable'>
                                                <Table striped bordered hover align='center'>
                                                    <thead>
                                                        <tr>
                                                            <th>Action</th>
                                                            <th>Recording</th>
                                                            <th>First Name</th>
                                                            <th>Last Name</th>
                                                            <th>Phone</th>
                                                            <th>State</th>
                                                            <th>Status</th>
                                                            <th>Ask</th>
                                                            <th>Notes</th>
                                                            <th>Tax Overdue</th>
                                                            <th>Contact ID</th>
                                                            <th>Last call</th>
                                                            <th>Last Dial Number</th>
                                                            <th>Call Member</th>
                                                            <th>Message Member</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>1</td>
                                                            <td>Mekaeil	</td>
                                                            <td>Andisheh</td>
                                                            <td>Front-End Developer</td>
                                                            <td>Mekaeil	</td>
                                                            <td>Andisheh</td>
                                                            <td>Front-End Developer</td>
                                                            <td>Mekaeil	</td>
                                                            <td>Andisheh</td>
                                                            <td>Front-End Developer</td>
                                                            <td>Mekaeil	</td>
                                                            <td>Andisheh</td>
                                                            <td>Front-End Developer</td>
                                                            <td>Mekaeil	</td>
                                                            <td>Andisheh</td>
                                                        </tr>
                                                        <tr>
                                                            <td>2</td>
                                                            <td>David</td>
                                                            <td>Keri</td>
                                                            <td>Back-End Developer</td>
                                                            <td>Mekaeil	</td>
                                                            <td>Andisheh</td>
                                                            <td>Front-End Developer</td>
                                                            <td>Mekaeil	</td>
                                                            <td>Andisheh</td>
                                                            <td>Front-End Developer</td>
                                                            <td>Mekaeil	</td>
                                                            <td>Andisheh</td>
                                                            <td>Front-End Developer</td>
                                                            <td>Mekaeil	</td>
                                                            <td>Andisheh</td>
                                                        </tr>
                                                        <tr>
                                                            <td>3</td>
                                                            <td>Jack</td>
                                                            <td>Cook</td>
                                                            <td>Designer</td>
                                                            <td>Mekaeil</td>
                                                            <td>Andisheh</td>
                                                            <td>Front-End Developer</td>
                                                            <td>Mekaeil	</td>
                                                            <td>Andisheh</td>
                                                            <td>Front-End Developer</td>
                                                            <td>Mekaeil	</td>
                                                            <td>Andisheh</td>
                                                            <td>Front-End Developer</td>
                                                            <td>Mekaeil	</td>
                                                            <td>Andisheh</td>
                                                        </tr>
                                                        <tr>
                                                            <td>4</td>
                                                            <td>Stive</td>
                                                            <td>Jobs</td>
                                                            <td>Co-Founder</td>
                                                            <td>Mekaeil</td>
                                                            <td>Andisheh</td>
                                                            <td>Front-End Developer</td>
                                                            <td>Mekaeil	</td>
                                                            <td>Andisheh</td>
                                                            <td>Front-End Developer</td>
                                                            <td>Mekaeil	</td>
                                                            <td>Andisheh</td>
                                                            <td>Front-End Developer</td>
                                                            <td>Mekaeil	</td>
                                                            <td>Andisheh</td>
                                                        </tr>
                                                        <tr>
                                                            <td>5</td>
                                                            <td>Jany</td>
                                                            <td>Anderson</td>
                                                            <td>Web Designer</td>
                                                            <td>Mekaeil</td>
                                                            <td>Andisheh</td>
                                                            <td>Front-End Developer</td>
                                                            <td>Mekaeil	</td>
                                                            <td>Andisheh</td>
                                                            <td>Front-End Developer</td>
                                                            <td>Mekaeil	</td>
                                                            <td>Andisheh</td>
                                                            <td>Front-End Developer</td>
                                                            <td>Mekaeil	</td>
                                                            <td>Andisheh</td>
                                                        </tr>
                                                    </tbody>
                                                </Table>
                                            </div>
                                        </div>
                                    </div>
                                </Container>
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
