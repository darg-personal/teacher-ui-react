import React from "react";
import { Avatar, IconButton, ListItemAvatar } from "@mui/material";
import { Card } from "react-bootstrap";
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CardHeader from "react-bootstrap/esm/CardHeader";

export function ImageView({
    type,
    image,
    profile,
    text,
    sender,
    time,
    float = "right",
}) {
    console.log(image,type);
    return (
        <div className="darker" id={float}>
            <Card
                style={{
                    width: "auto",
                    height: "60%",
                    borderColor: "#464444",
                    background: "#464444",
                }}
            >
                {float === "left" ? (
                    <CardHeader style={{ borderColor: "transparent" }}>
                        <span style={{ float: "right" }}>{sender}</span>
                    </CardHeader>
                ) : null}
                {/* <img height='210px' width='auto' style={{
                      borderRadius: '10px'
                  }} src={image} /> */}

                {type === "audio/mpeg" ? (
                    <li key={image}>
                        <audio src={image} controls />
                    </li>
                ) : (
                    <img
                        height="210px"
                        width="auto"
                        style={{
                            borderRadius: "10px",
                        }}
                        src={image}
                    />
                )}

                <p style={{ marginLeft: "10px" }}>{text !== "NA" ? text : null}</p>

                <span className="time-right">{time}</span>
            </Card>
        </div>
    );
}


export function TextView({ sender, profile, text, time, float = 'right' }) {
    return (
        <div className="container darker" id={float}>
            <Card style={{
                width: 'auto',
                height: '60%',
                borderColor: "#aaa", background: 'transparent',
                borderRight: '0'
            }}>

                <ListItemAvatar style={{ float: 'right' }}>
                    <Avatar alt={sender} src={profile} style={{
                        marginLeft: '10px',
                        height: '35px',
                        width: '35px',
                        float: 'right'
                    }} />
                    {sender === 'Me' ?
                        <span className="name right">Me</span>
                        :
                        <span className="name right">{sender}</span>
                    }
                </ListItemAvatar>
            </Card>
            <p style={{ marginLeft: 0 }}> {text}</p>
            <p className="time-right" style={{ marginLeft: 0 }}>{time}</p>
        </div>
    )
}

export function ImgUpload({ onChange, src }) {
    return (
        <IconButton color="primary" aria-label="upload picture" component="label" >
            <input hidden accept="image/*" type="file" onChange={onChange} />
            <AttachFileIcon />
        </IconButton>
    );
};


export function ImageShow({ filePreviewUrl }) {
    return (
        <div className="image-show-view">
            <img
                src={filePreviewUrl}
                height={'40%'}
                width={'80%'}
            />
        </div>
    );
};

export function ChatHeader({ name, props, type, image, ws = null }) {
    return (
        <div className="profile-header">
            <div className="header-chat">

                {/* <div>
              <AiOutlineArrowLeft
                style={{ color: "#fff", height: "30" }}
                onClick={() => {
                  navigate("/dashboard");
                }}
              />
            </div> */}
                <ListItemAvatar onClick={() => props.show({ show: true, type: type, websocket: ws })}>
                    <Avatar alt={name} src={image} />
                </ListItemAvatar>
                <li className="" style={{ color: 'white', fontWeight: 'bold' }} >{name}</li>

            </div>
        </div>
    )
}