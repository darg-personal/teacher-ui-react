import React from 'react'
import { Card } from 'react-bootstrap'
import { Avatar, ListItemAvatar } from "@mui/material";
function SearchChannelCard(props) {
    let About = props.About
    const getChannels = (data) => {
        props.onClick(data);
    }
    return (
        <div style={{ marginLeft: '200px' }}>
            <Card className='my-3 p-3 rounded' style={{ width: "300px", display: "flex", flexWrap: 'wrap' }}>
                <div style={{ display: "flex" }}>

                    <ListItemAvatar >
                        <Avatar alt={About.orgName} src={About.thumb}
                            style={{ height: '50px', width: '50px'
                            }} />
                    </ListItemAvatar>
                    <div style={{ marginLeft: "30px" }} >
                        <p > {About.email}</p>
                        <p >Contact :{About.phone_number}</p>
                    </div>
                </div>
                <div>
                    <p >ORGINIZATION: {About.orgName}</p>
                    <p >OWNER:  {About.owner}</p>
                    <p >About :  {About.about}</p>
                </div>
                <hr style={{ width: '100%' }}></hr>
                <button type="click"
                    style={{ float: 'right', width: '150px', padding: '5px', marginLeft: "50px" }}
                    className="button-upload-org"
                    onClick={() =>
                        getChannels(About)
                    }>Manage</button>
            </Card>
        </div>

    )
}

export default SearchChannelCard