import React, { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import { Button, Form, Dropdown } from "react-bootstrap";

import { Avatar, IconButton, ListItemAvatar } from "@mui/material";
import Dialog from '@mui/material/Dialog';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import VideocamIcon from "@mui/icons-material/Videocam";
import CallIcon from "@mui/icons-material/Call";
import CallEndIcon from '@mui/icons-material/CallEnd';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { HiOutlineEmojiHappy } from "react-icons/hi";
import { BiDotsVerticalRounded } from "react-icons/bi";

import Record from "../../Recorder";
import Music from './skype_ringtone (1).mp3';
import 'react-toastify/dist/ReactToastify.css';
toast.configure()

export const notify = (username, type) => {
    // toast(`New Message Received..!`, {
    toast(
        type === "Channel"
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
export function ChatLinkView({
    type,
    link,
    profile,
    text,
    sender,
    time,
    float = "right",
}) {
    return (
        <div>
            {type.includes('call') ? (
                <div className="user-call">
                    {type.includes('video') ?
                        <VideocamIcon
                            style={{
                                color: "black", fontSize: "20px",
                            }}
                        >
                            {`  Video `}
                        </VideocamIcon> :
                        <CallIcon
                            style={{
                                color: "black", fontSize: "20px",
                            }}
                        >
                            {`  Audio `}
                        </CallIcon>
                    }
                    <p > Call at {time}</p>
                </div>
            )
                :
                (<div className="messages-chat">
                    {sender !== "Me" ? (
                        <div style={{ backgroundColor: '#b8d8fd', justifyContent: 'center', borderRadius: '20px', marginLeft: '40px' }} id={float}>
                            <span style={{
                                float: 'right', fontSize: '12px',
                                padding: '0px 5px', borderRadius: '10px 5px'
                            }}>{sender}</span>
                            <div className="message">
                                {type.includes('audio') && (
                                    <audio src={link} controls style={{
                                        borderRadius: "10px ",
                                    }} />
                                )}
                                {type.includes('image') && (
                                    <>
                                        <img
                                            alt={sender}
                                            height="210px"
                                            width="auto"
                                            style={{
                                                borderRadius: "10px ",
                                            }}
                                            src={link}
                                        />
                                    </>

                                )}
                            </div>
                            <p style={{
                                float: 'right', fontSize: '12px',
                                padding: '0px 5px', borderRadius: '10px 5px', color: 'black',
                            }}>{time}</p>
                        </div>
                    ) : (
                        <div style={{ backgroundColor: '#d2e6fc', justifyContent: 'center', borderRadius: '20px 20px 0px 3px', marginLeft: '40px' }} id={float} >
                            <div >
                                {type.includes('audio') && (
                                    <li key={link}>
                                        <audio src={link} controls style={{
                                            borderRadius: "10px ",
                                        }} />
                                    </li>
                                )}
                                {type.includes('image') && (
                                    <>
                                        <img
                                            alt={sender}
                                            height="210px"
                                            width="auto"
                                            style={{
                                                borderRadius: "10px ",
                                            }}
                                            src={link}
                                        />
                                    </>

                                )}
                                {/* {type.includes('videocall') && (
                                <p style={{ marginLeft: "10px" }}>video Call start</p>
                            )} */}

                            </div>
                            <p
                                style={{
                                    float: 'right', fontSize: '12px', color: 'black',
                                    padding: '5px 5px ', borderRadius: '10px 5px'
                                }}
                            >{time}</p>
                        </div>
                    )}
                </div>)
            }
        </div>
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
                        <img alt={sender} src={profileSrc} style={{ width: '100px', marginLeft: '41px' }}></img>
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
export function TextView({ sender, profile, text, time, type }) {
    return (
        <section className="chat">
            <div className="messages-chat">
                {sender !== "Me" ? (
                    <>
                        {
                            type === "Channel" ? <span style={{ marginLeft: '40px', fontSize: '12px', backgroundColor: '#b8d8fd', padding: '2px 5px', borderRadius: '5px' }}>{sender}</span> : null
                        }
                        <div className="message">
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
        <IconButton color="primary" aria-label="upload picture" component="label" data-toggle="tooltip" data-placement="top" title="Share image">
            <input hidden accept="image/*" type="file" onChange={onChange} />
            <AttachFileIcon />
        </IconButton>
    );
};


export function ImageShow({ className, filePreviewUrl }) {
    return (
        <div className={className}>
            <img class="img-fluid"
                alt={`xyz`}
                src={filePreviewUrl}
                style={{
                    height: "150px",
                    width: "150%",
                }}
            />
        </div>
    );
};

export function ChatImageShow({ className, filePreviewUrl }) {
    return (
        <div className="d-flex justify-content-center">
            <img class="img-fluid"
                alt={'xyz'}
                src={filePreviewUrl}
                height={'150px'}
                width={'60%'}
                style={{padding:'10px'}}
            />
        </div>
    );
};
export function ChatHeader({ name, props, type, image, ws = null, onclickVoice, onclickVedio, chatroomId }) {
    return (
        <div className="profile-header">
            <div className="header-chat">
                <div style={{ cursor: 'pointer', }} onClick={() => props.show({
                    show: true,
                    type: type, websocket: ws, chatroomId: chatroomId
                })}>
                    <ListItemAvatar className="d-flex justify-content-center ms-4" >
                        <Avatar alt={name} src={image} />
                        <span style={{
                            marginLeft: '10px', fontSize: '18px',
                            backgroundColor: '#f6f6f6', padding: '5px 5px', borderRadius: '10px 5px'
                        }}>{name}</span>
                    </ListItemAvatar>
                </div>
                <div style={{ display: 'flex', float: 'right', alignContent: 'center', margin: '0px 0px' }}>
                    <div data-toggle="tooltip" data-placement="right" title="Voice Call">
                    <CallIcon
                        style={{
                            color: "white", fontSize: "30px",
                            cursor: "pointer", margin: '5px 20px'
                        }}
                        onClick={onclickVoice}
                    >
                    </CallIcon>
                    </div>
                        <div  data-toggle="tooltip" data-placement="right" title="Video Call"> 
                        <VideocamIcon
                        style={{
                            color: "white", fontSize: "30px",
                            cursor: "pointer", margin: '5px 20px'
                        }}
                        onClick={onclickVedio}
                    ></VideocamIcon>
                        </div>

                    <Dropdown>
                        <Dropdown.Toggle variant="white" id="dropdown-basic"
                            style={{ border: 'none', color: 'transparent' }}>
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

export function ChatFooter({ inputRef, handleClick, onStopRecording, photoUpload, sendImage, isConnected }) {
    const [sendVoiceNote, setSendVoiceNote] = useState(true);
    useEffect(() => {
        if (inputRef.current.value === "")
            setSendVoiceNote(true)
    }, [inputRef.current.value])
    return (
        <Form>
            {isConnected === 0 ?
                <div className="box">
                    <HiOutlineEmojiHappy style={{ cursor: 'pointer', fontSize: '30px', color: '#128c7e' }} />
                    <input
                        ref={inputRef}
                        className='input_text'
                        id="inp"
                        type="text"
                        placeholder="Enter Text Here..."
                        onKeyDown={(e) => e.key === "Enter" || (handleClick || setSendVoiceNote(true))}
                        onChange={(value) => value.target.value.length > 0 ? setSendVoiceNote(false) :
                            setSendVoiceNote(true)}
                        style={{ border: 'none', borderRadius: '20px', outline: 'none', backgroundColor: '#e2dfdf' }}
                        autoComplete='off' autoFocus
                    />
                    <ImgUpload onChange={photoUpload} />
                    {!sendVoiceNote || sendImage ?
                        <button onClick={handleClick || setSendVoiceNote(false)}
                            className="btn btn-outline-primry" style={{ border: 'none', color: 'dodgerblue', }}>
                            <SendRoundedIcon onClick={() => setSendVoiceNote(true)}
                                style={{ cursor: 'pointer' }} sx={{ fontSize: '30px', color: '#128c7e' }} />
                        </button>
                        :
                        <Record onStopRecording={onStopRecording}></Record>
                    }
                </div>
                :
                <p style={{
                    justifyContent: 'center',
                    textAlign: 'center',
                    paddingTop: '30px' ,color:'chocolate'
                }} >{`Not allowed to send message`}</p>
            }
        </Form>
    )
}