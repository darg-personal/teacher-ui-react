import React, { useState } from 'react'
import Header from '../../pages/auth/Header'
import Sidebar from '../../pages/auth/Sidebar'
import lesson_list_new  from "../../css/lesson/lesson_list_new.scss"
import { Button, Col, Container, Form, Modal, Pagination, Row, } from 'react-bootstrap'
import { FaPlus } from 'react-icons/fa'
import { AiFillEye, AiOutlineCheck } from 'react-icons/ai'
import {  BsPencilFill } from 'react-icons/bs'
import { TiTimes } from 'react-icons/ti'

let active = 1;
let items = [];
for (let number = 1; number <= 3; number++) {
  items.push(
    <Pagination.Item key={number} active={number === active}>
      {number}
    </Pagination.Item>,
  );
}


export default function Lesson_list_new() {
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
                <div className='new_lesson'>
                    <h1>Lesson Pannel</h1>
                    <div className='lesson_modal'>
                        <Button variant="primary" onClick={handleShow}>
                            <FaPlus/>Lessons
                        </Button>
                    <hr></hr>
                    <Modal show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                        <Modal.Title><h5>Add Lesson</h5></Modal.Title>
                        </Modal.Header>
                        <Modal.Body> 
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Course Name</Form.Label>
                                <Form.Control type="email" placeholder="Course Name" />
                            </Form.Group>
                            <div className='submit'>
                                <Button>Submit</Button>
                            </div>
                        </Modal.Body>
                    </Modal>
                    </div>
                    <div className='lesson_list'>
                        <Row>
                            <Col className='col-12 col-lg-6 col-xl-3'>
                                <div className='lesson_box'>
                                    <p>Lesson 1</p>
                                    <h1>Lesson Name</h1>
                                    <div className='mark_asread'>
                                        <AiOutlineCheck/>
                                        <p> Mark as Completed</p>
                                    </div>
                                    <hr></hr>
                                    <div className='icons'>
                                        <Button><AiFillEye/></Button>
                                        <Button><BsPencilFill/></Button>
                                        <Button><TiTimes/></Button>
                                    </div>
                                </div>
                            </Col>
                            <Col className='col-12 col-lg-6 col-xl-3'>
                                <div className='lesson_box'>
                                    <p>Lesson 1</p>
                                    <h1>Lesson Name</h1>
                                    <div className='mark_asread'>
                                        <AiOutlineCheck/>
                                        <p> Mark as Completed</p>
                                    </div>
                                    <hr></hr>
                                    <div className='icons'>
                                        <Button><AiFillEye/></Button>
                                        <Button><BsPencilFill/></Button>
                                        <Button><TiTimes/></Button>
                                    </div>
                                </div>
                            </Col>
                            <Col className='col-12 col-lg-6 col-xl-3'> 
                                <div className='lesson_box'>
                                    <p>Lesson 1</p>
                                    <h1>Lesson Name</h1>
                                    <div className='mark_asread'>
                                        <AiOutlineCheck/>
                                        <p> Mark as Completed</p>
                                    </div>
                                    <hr></hr>
                                    <div className='icons'>
                                        <Button><AiFillEye/></Button>
                                        <Button><BsPencilFill/></Button>
                                        <Button><TiTimes/></Button>
                                    </div>
                                </div>
                            </Col>
                            <Col className='col-12 col-lg-6 col-xl-3'> 
                                <div className='lesson_box'>
                                    <p>Lesson 1</p>
                                    <h1>Lesson Name</h1>
                                    <div className='mark_asread'>
                                        <AiOutlineCheck/>
                                        <p> Mark as Completed</p>
                                    </div>
                                    <hr></hr>
                                    <div className='icons'>
                                        <Button><AiFillEye/></Button>
                                        <Button><BsPencilFill/></Button>
                                        <Button><TiTimes/></Button>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col className='col-12 col-lg-6 col-xl-3'>
                                <div className='lesson_box'>
                                    <p>Lesson 1</p>
                                    <h1>Lesson Name</h1>
                                    <div className='mark_asread'>
                                        <AiOutlineCheck/>
                                        <p> Mark as Completed</p>
                                    </div>
                                    <hr></hr>
                                    <div className='icons'>
                                        <Button><AiFillEye/></Button>
                                        <Button><BsPencilFill/></Button>
                                        <Button><TiTimes/></Button>
                                    </div>
                                </div>
                            </Col>
                            <Col className='col-12 col-lg-6 col-xl-3'>
                                <div className='lesson_box'>
                                    <p>Lesson 1</p>
                                    <h1>Lesson Name</h1>
                                    <div className='mark_asread'>
                                        <AiOutlineCheck/>
                                        <p> Mark as Completed</p>
                                    </div>
                                    <hr></hr>
                                    <div className='icons'>
                                        <Button><AiFillEye/></Button>
                                        <Button><BsPencilFill/></Button>
                                        <Button><TiTimes/></Button>
                                    </div>
                                </div>
                            </Col>
                            <Col className='col-12 col-lg-6 col-xl-3'> 
                                <div className='lesson_box'>
                                    <p>Lesson 1</p>
                                    <h1>Lesson Name</h1>
                                    <div className='mark_asread'>
                                        <AiOutlineCheck/>
                                        <p> Mark as Completed</p>
                                    </div>
                                    <hr></hr>
                                    <div className='icons'>
                                        <Button><AiFillEye/></Button>
                                        <Button><BsPencilFill/></Button>
                                        <Button><TiTimes/></Button>
                                    </div>
                                </div>
                            </Col>
                            <Col className='col-12 col-lg-6 col-xl-3'> 
                                <div className='lesson_box'>
                                    <p>Lesson 1</p>
                                    <h1>Lesson Name</h1>
                                    <div className='mark_asread'>
                                        <AiOutlineCheck/>
                                        <p> Mark as Completed</p>
                                    </div>
                                    <hr></hr>
                                    <div className='icons'>
                                        <Button><AiFillEye/></Button>
                                        <Button><BsPencilFill/></Button>
                                        <Button><TiTimes/></Button>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <div>
                    <div className='pages'> 
                        <Pagination> 
                            <Button className='prevoius'>Prevoius</Button>
                            {items}
                            <Button className='next'>Next</Button>
                        </Pagination>
                    </div>
                    </div>
                </div>
            </Container>
            </div>
        </div>
    </div>
  )
}