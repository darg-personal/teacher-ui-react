import React from 'react'
import Header from '../../pages/auth/Header'
import Sidebar from '../../pages/auth/Sidebar'
import teacher from "../../css/teacher/teacher.scss"
import { Button, Container, Dropdown, Pagination, Table } from 'react-bootstrap'
import {  AiOutlineUnorderedList } from 'react-icons/ai'
import { BsArrowDown, BsFillCaretDownFill } from 'react-icons/bs'
import { useState, useEffect, useCallback} from 'react';
import Paginations from "./Pagination";


let active = 2;
let items = [];
for (let number = 1; number <= 2; number++) {
    items.push(
      <Pagination.Item key={number} active={number === active}>
        {number}
      </Pagination.Item>,
    );
  }
  

export default function Teacher() {
    const [data, setData] = useState('');


    useEffect(() => {
        getPosts();
      }, []);
    
    const getPosts = () => {
      fetch(`http://127.0.0.1:8000/students_list/get/teachers`)
      .then(res => res.json())
      .then(res => {
       setData(res);
       console.log("==========data",res)
       console.log("==========",setData)
      
      })
      .catch((error) => console.log(error));
    };
    let NUM_OF_RECORDS = data;
    let LIMIT = 5;
  

  return (
    <div className="dashboard-wrapper">
        <Sidebar />
            <div className="header-main">
            <Header />
            <Container>
                <div className='teacher'>
                    <div className='list_of_teacher'>
                        <h1>List of Teacher</h1>
                        <div className='value'>
                            <label>Show</label>
                            <select name="cars" id="cars">
                                    <option value="volvo">10</option>
                                    <option value="saab">25</option>
                                    <option value="mercedes">50</option>
                                    <option value="audi">100</option>
                            </select>
                            <p>entries</p>
                        </div>
                        <div className='table'>
                        <Table striped bordered>
                            <thead>
                                <tr>
                                <th>
                                    <div className='name'>
                                        <div>
                                            Name    
                                        </div>
                                        <div className="addname">
                                            <BsArrowDown/><BsArrowDown/>
                                        </div>
                                    </div>
                                    </th>
                                <th>
                                    <div className='name'>
                                        <div>
                                            Add    
                                        </div>
                                        <div className="addname">
                                            <BsArrowDown/><BsArrowDown/>
                                        </div>
                                    </div>
                                </th>
                                </tr>
                            </thead>
                            <tbody>
                           {data.map((item) => (
                                <tr>
                       
                                     <td>{item.username}</td>
                                    <td><Button><AiOutlineUnorderedList/></Button></td>
                                </tr>
                                ))}
                            </tbody>
                            </Table>
                        </div>
                        <div className='result'>
                            <h2>Showing 1 to 50 of 65 entries</h2>
                        </div>
                       
                        <div className='paginations'>
                            <Pagination>
                                <Button>Prevoius</Button>{items}<Button>Next</Button>
                            </Pagination>
                                <br />
                        </div>
                    </div>
                </div>
            </Container>
            </div>
    </div>
  )
}
