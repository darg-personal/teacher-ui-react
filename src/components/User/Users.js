import React from 'react'
import { Container, Table } from 'react-bootstrap'
import Header from '../../pages/auth/Header'
import Sidebar from '../../pages/auth/Sidebar'
import users from "../../css/User/users.scss"
import { Navigate } from "react-router-dom";

let Token = localStorage.getItem("token");

export default function Users() {
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
                                    <div className='users'>
                                        <h2>Users</h2>
                                        <div className='userdata'>
                                            <Table striped bordered>
                                                <thead>
                                                    <tr>
                                                        <th>Joined</th>
                                                        <th>Name</th>
                                                        <th>Phone</th>
                                                        <th>Info</th>
                                                        <th>Call Member</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>1</td>
                                                        <td>Mark</td>
                                                        <td>Otto</td>
                                                        <td>@mdo</td>
                                                        <td>@mdo</td>
                                                    </tr>
                                                    <tr>
                                                        <td>2</td>
                                                        <td>Jacob</td>
                                                        <td>Thornton</td>
                                                        <td>@fat</td>
                                                        <td>@mdo</td>
                                                    </tr>
                                                    <tr>
                                                        <td>3</td>
                                                        <td colSpan={2}>Larry the Bird</td>
                                                        <td>@twitter</td>
                                                        <td>@mdo</td>
                                                    </tr>
                                                </tbody>
                                            </Table>
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
