import React, { useEffect, useRef, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import utils from "../../pages/auth/utils";
import Avatar from "@mui/material/Avatar";

import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Sidebar from "../../pages/auth/Sidebar";
import Header from "../../pages/auth/Header";
const UserRequest = (props) => {

    const [value, setvalue] = useState([]);
    // const org = props.org;
    // const channel = props.Channel;
        const org = 1;
    const channel =1;
    let id = props;
    console.log(id,"=-099");
    let Token = localStorage.getItem("token");

    const getRequests = () => {

        axios
            .get(`${utils.getHost()}/chat/userRequest/${org}/${channel}`,
                { 
                headers: {
                Authorization: `Bearer ${Token}`,
            },
                })
            .then((res) => {
                const responseData = JSON.stringify(res.data);
                const tempResponse = JSON.parse(responseData);
                console.log(tempResponse);
                let value = [];
                for (var i = 0; i < tempResponse.length; i++) {
                    value.push({
                        user: tempResponse[i]?.user.username,
                        id: tempResponse[i]?.user.id,
                        request: tempResponse[i].request_type,
                        channel: tempResponse[i].Channel,
                    });
                }
                setvalue(value);
            });
    }
useEffect(() => {
    getRequests()
}, []);

return (
    <>
        {
            Token ? (
                <div className="dashboard-wrapper">
                    <Sidebar />
                    <div className="header-main">
                        <Header />
                        <div className='App'>

                            {value.map((e, i) => (
                                <div style={{ display: 'flex' }}>
                                    {e.user},
                                    {e.request}
                                    <div>
                                        <ListItemAvatar>
                                            <Avatar alt={e.request} />
                                        </ListItemAvatar>
                                        <ListItemText psecondary="last seen 08:00" />

                                        <li>{e.request_type}</li>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )
                : (
                    <Navigate replace to="/login" />
                )}

    </>
);
};

export default UserRequest;
