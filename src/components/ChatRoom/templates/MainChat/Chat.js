import React, { useState } from "react";
import { Avatar, IconButton, ListItemAvatar } from "@mui/material";
import { Button, Card } from "react-bootstrap";
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CardHeader from "react-bootstrap/esm/CardHeader";
import Modal from 'react-bootstrap/Modal';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Music from './skype_ringtone (1).mp3';
import CallIcon from "@mui/icons-material/Call";
import CallEndIcon from '@mui/icons-material/CallEnd';
import { toast } from 'react-toastify';
import VideocamIcon from "@mui/icons-material/Videocam";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { Dropdown } from "react-bootstrap";

import 'react-toastify/dist/ReactToastify.css';
toast.configure()

export const notify = (username, type) => {
    // toast(`New Message Received..!`, {
    toast(
        type == "Channel"
            ? `New Message In ${username}..!`
            : `New Message From ${username}..!`,
        {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
}

function answer(data) {

    console.log({ data });
    {
        function popupWindow(url, windowName, win, w, h, username) {
            const y = win.top.outerHeight / 2 + win.top.screenY - (h / 2);
            const x = win.top.outerWidth / 2 + win.top.screenX - (w / 2);
            return win.open(url, windowName, `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${w}, height=${h}, top=${y}, left=${x}`);
        }
        popupWindow(data, 'test', window, 800, 600);
    }
}
export function ImageView({
    type,
    image,
    profile,
    text,
    sender,
    time,
    float = "right",
}) {
    return (


        <section className="chat">
            <div className="messages-chat">
                <>
                    <p>
                        {float === "left" ? (
                            <span style={{ marginLeft: '7%', fontSize: '12px', backgroundColor: '#E6E7ED', padding: '5px', borderRadius: '10px 5px' }} >{sender}</span>
                        ) : null}
                    </p>
                    <ListItemAvatar style={{ float: { float } }} id={float}>
                        <Avatar alt={sender} src={profile} style={{
                            marginLeft: '10px',
                            height: '35px',
                            width: '35px',
                            float: { float }
                        }} />
                    </ListItemAvatar>
                    <div className="messages-chat" id={float}>
                        {type.includes('audio') && (
                            <li key={image}>
                                <audio src={image} controls />
                            </li>
                        )}
                        {type.includes('image') && (
                            <img
                                height="210px"
                                width="auto"
                                style={{
                                    borderRadius: "0px 10px 10px 10px ",
                                }}
                                src={image}
                            />
                        )}
                        {type === "message/videocall" && (
                            <p style={{ marginLeft: "10px" }}>video Call start</p>
                        )}
                        {/* {type.includes("videocall") && (
                            <p style={{ marginLeft: "10px" }}>videoCallEnd</p>

                        )} */}

                    </div>

                </>

                {/* {sender !== "Me" ? (
        <>
            {float === "left" ? (
                <span style={{ marginLeft: '6%', fontSize: '12px' }}>{sender}</span>
            ) : null}
            <div className="message">
                <div
                    className="photo"     >
                    <ListItemAvatar>
                        <Avatar
                            alt={sender}
                            src={profile}
                            style={{
                                height: "35px",
                                width: "35px",
                                backgroundPosition: "center",
                                display: "block",
                                backgroundSize: "cover",
                            }}
                        />
                    </ListItemAvatar>
                </div>
                <p className="text">{text} </p>
            </div>
            <p className="time">{time}</p>
        </>
    ) : (
        <>
            <div className="message text-only">
                <div className="response">
                    <p className="text">{text}</p>
                </div>
            </div>
            <p className="response-time time">{time}</p>
        </>
    )} */}
            </div>
        </section>



    );
}

export function Answer({
    type,
    image,
    profile,
    text,
    sender,
    ws,
}) {
    const profileSrc = localStorage.getItem("loginUserImage");
    const Callend = () => {
        ws.send(
            JSON.stringify({
                meta_attributes: "react",
                message_type: "message/videocall_end" || 'message/voicecall_end',
                media_link: 'https://conference.dreampotential.org/videocall',
                message_text: "Call Ended",
            })
        );
        console.log(open, 'open ======');
        setOpen(false)
        soundPlayer.pause();
    }
    let loggedUser = JSON.parse(localStorage.getItem("user"));
    const [open, setOpen] = useState(true);
    let soundPlayer = new Audio(Music);
    { open === true ? soundPlayer.play() : soundPlayer.pause() }
    { open === true ? soundPlayer.loop = true : soundPlayer.pause() }
    setTimeout(() => {
        setOpen(false)
        soundPlayer.pause()
    }, 50000)
    return (
        <div>
            <Dialog
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                // open={open().then(open === false ? open === true : open === false)}
                open={open}
            >
                <DialogTitle id="alert-dialog-title">
                    {loggedUser.username}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <img src={profileSrc} style={{ width: '100px', marginLeft: '41px' }}></img>
                    </DialogContentText>
                    <DialogContentText style={{ marginLeft: '27%' }} id="alert-dialog-description">
                        <p style={{ fontSize: '8px', marginLeft: '-16px', marginTop: '4px' }}>Do you Want to Pick up The Call</p>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button style={{ marginRight: '43%' }} className="bg-success" onClick={() => { answer(image); setOpen(false); soundPlayer.pause() }} autoFocus>
                        <CallIcon />
                    </Button>
                    <Button className="bg-danger " onClick={Callend}><CallEndIcon /></Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
// #075E54
export function TextView({ sender, profile, text, time, float = 'right' }) {
    return (
        // <div >
        //     {float === "left" ? (
        //         <span style={{ marginLeft: '6%',fontSize: '12px' }}>{sender}</span>
        //     ) : null}
        //     <CardHeader>
        //         <ListItemAvatar style={{ float: { float } }} id={float}>
        //             <Avatar alt={sender} src={profile} style={{
        //                 marginLeft: '10px',
        //                 height: '35px',
        //                 width: '35px',
        //                 float: { float }
        //             }} />
        //         </ListItemAvatar>
        //     </CardHeader>
        //     <div className="darker" id={float}>

        //         <p style={{ marginLeft: "10px" }}>{text !== "NA" ? text : null}
        //             <span style={{ marginLeft: 0, fontSize: '12px' }} >&emsp;{time}&ensp;</span>
        //         </p>
        //     </div>
        // </div>

        <section className="chat">
            <div className="messages-chat">
                {sender !== "Me" ? (
                    <>
                        {float === "left" ? (
                            <span style={{ marginLeft: '7%', fontSize: '12px', backgroundColor: '#f6f6f6', padding: '5px', borderRadius: '10px 5px' }}>{sender}</span>
                        ) : null}
                        <div className="message">
                            <div
                                className="photo"     >
                                <ListItemAvatar>
                                    <Avatar
                                        alt={sender}
                                        src={profile}
                                        style={{
                                            height: "35px",
                                            width: "35px",
                                            backgroundPosition: "center",
                                            display: "block",
                                            backgroundSize: "cover",
                                        }}
                                    />
                                </ListItemAvatar>
                            </div>
                            <p className="text">{text} </p>
                        </div>
                        <p className="time">{time}</p>
                    </>
                ) : (
                    <>
                        <div className="message text-only">
                            <div className="response">
                                <p className="text">{text}</p>
                            </div>
                        </div>
                        <p className="response-time time">{time}</p>
                    </>
                )}
            </div>
        </section>

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


export function ImageShow({ className, filePreviewUrl }) {
    return (
        <div className={className}>
            <img
                src={filePreviewUrl}
                height={'40%'}
                width={'80%'}
            />
        </div>
    );
};
export function ChatHeader({ name, props, type, image, ws = null, onclickVoice, onclickVedio, chatroomId }) {
    return (
        <div className="profile-header">
            <div className="header-chat">
                <ListItemAvatar onClick={() => props.show({ show: true, type: type, websocket: ws, chatroomId : chatroomId  })} className="d-flex justify-content-center">
                    <Avatar alt={name} src={image} />
                    <span style={{ fontSize: '18px', backgroundColor: '#f6f6f6', padding: '5px', borderRadius: '10px 5px' }}>{name}</span>
                </ListItemAvatar>
                <div style={{ display: 'flex', float: 'right', alignContent: 'center', margin: '0px 0px' }}>
                    <CallIcon
                        style={{
                            color: "white", fontSize: "30px",
                            cursor: "pointer", margin: '5px 20px'
                        }}
                        onClick={onclickVoice}
                    >
                    </CallIcon>

                    <VideocamIcon
                        style={{
                            color: "white", fontSize: "30px",
                            cursor: "pointer", margin: '5px 20px'
                        }}
                        onClick={onclickVedio}
                    ></VideocamIcon>
                    <Dropdown>
                        <Dropdown.Toggle variant="white" id="dropdown-basic" style={{ border: 'none', color: 'transparent' }}>
                            <BiDotsVerticalRounded
                                id="dropdown-basic"
                                style={{ color: "#FFF", marginTop: '5px' }}
                                fontSize='25px'
                            ></BiDotsVerticalRounded>
                        </Dropdown.Toggle>

                        <Dropdown.Menu className="drop">
                            <Dropdown.Item>Settings</Dropdown.Item>
                            <Dropdown.Item>Details</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </div>
        </div>
    )
}