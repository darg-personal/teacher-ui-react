import React, { useState } from 'react'
import Header from '../../pages/auth/Header'
import Sidebar from '../../pages/auth/Sidebar'
import { Button, Col, Container, Form, Modal, Row, Table } from 'react-bootstrap'
import { FaPlus } from 'react-icons/fa'
import '../../css/room/room_visitor.scss'

export default function Room_visitor() {
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
            <div className='add_student'>
                    <div className='student'>
                        <h1>List of Rooms Visitors</h1>
                        <div>
                        <Button onClick={handleShow}><FaPlus/>Add</Button>
                        <Modal
                        className="stu_modal"
                            show={show}
                            onHide={handleClose}
                            backdrop="static"
                            keyboard={false}
                        >
                            <Modal.Header closeButton>
                            <Modal.Title><h5>Add Room</h5></Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                            <Container>
                                <div className='form'>
                                <Row>
                                    <Col xs={12}>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label>Room Name</Form.Label>
                                        <Form.Control type="email" placeholder="Enter Room" />
                                    </Form.Group>
                                    </Col>
                                    <Col xs={12}>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label>Room Logo</Form.Label>
                                        <Form.Control type="file" placeholder="Email" />
                                    </Form.Group>
                                    </Col>
                                </Row>
                                <div className='submit'>
                                    <Button>Submit</Button>
                                </div>
                                </div>
                            </Container>
                            </Modal.Body>
                        </Modal>
                        </div>
                    </div>
                    <div className='stu_table'>
                    <Table striped bordered>
                        <thead>
                            <tr>
                            <th>User Name</th>
                            <th>Email</th>
                            <th>Phone Number</th>
                            <th>Room Name</th>
                            <th>Room Logo</th>
                            <th>Edit</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                            <td>1</td>
                            <td>Mark</td>
                            <td>Otto</td>
                            <td>@mdo</td>
                            <td>@mdo</td>
                            <td>@mdo</td>

                            </tr>
                            <tr>
                            <td>2</td>
                            <td>Jacob</td>
                            <td>Thornton</td>
                            <td>@fat</td>
                            <td>@fat</td>
                            <td>@fat</td>
                            </tr>
                            <tr>
                            <td>3</td>
                            <td>Larry the Bird</td>
                            <td>@twitter</td>
                            <td>@twitter</td>
                            <td>@twitter</td>
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
  )
}
