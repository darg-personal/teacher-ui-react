import React from 'react'
import Header from '../../pages/auth/Header'
import Sidebar from '../../pages/auth/Sidebar'
import { Button, Container, Table } from 'react-bootstrap'
import { FaPlus } from 'react-icons/fa'
import lesson_list from "../../css/lesson/lesson_list.scss"

export default function Lesson_list() {
  return (
    <div>
        <div className="dashboard-wrapper">
        <Sidebar />
            <div className="header-main">
            <Header />
            <Container>
              <div className='list_of_lesson'>
                <div className='list_lesson'>
                    <h1>List of Lessons</h1>
                    <Button><FaPlus/>Add</Button>
                </div>
                <div className='lesson_data'>
                <Table striped bordered>
                    <thead>
                      <tr>
                        <th>Course Id</th>
                        <th>Course Name</th>
                        <th>Class Name</th>
                        <th>Edit</th>
                      </tr>
                    </thead>
                    {/* <tbody>
                      <tr>
                        <td>1</td>
                        <td>Mark</td>
                        <td>Otto</td>
                        <td>@mdo</td>
                      </tr>
                      <tr>
                        <td>2</td>
                        <td>Jacob</td>
                        <td>Thornton</td>
                        <td>@fat</td>
                      </tr>
                      <tr>
                        <td>3</td>
                        <td colSpan={2}>Larry the Bird</td>
                        <td>@twitter</td>
                      </tr>
                    </tbody> */}
                  </Table>
                </div>
              </div>
            </Container>
            </div>
            </div>
    </div>
  )
}
