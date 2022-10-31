import React, { useState } from "react";
import { Avatar, IconButton, ListItemAvatar } from "@mui/material";
import { Button, Card, Form } from "react-bootstrap";
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
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import Picker from 'emoji-picker-react';


import 'react-toastify/dist/ReactToastify.css';
import Record from "../../Recorder";
import { HiOutlineEmojiHappy } from "react-icons/hi";
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
                            <p style={{
                                float: 'right', fontSize: '12px',
                                padding: '0px 5px', borderRadius: '10px 5px', color: 'black',
                            }}>{time}</p>
                        </div>
                    ) : (
                        <div style={{ height: 'auto', backgroundColor: '#d2e6fc', justifyContent: 'center', borderRadius: '20px 20px 0px 3px', marginLeft: '40px' }} id={float} >
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
        <section className="chat">
            <div className="messages-chat">
                {sender !== "Me" ? (
                    <>
                        <span style={{ marginLeft: '45px', fontSize: '12px', backgroundColor: '#b8d8fd', padding: '0px 5px', borderRadius: '10px 5px' }}>{sender}</span>
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
                <ListItemAvatar onClick={() => props.show({ show: true, type: type, websocket: ws, chatroomId: chatroomId })} className="d-flex justify-content-center">
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

export function ChatFooter({ inputRef, handleClick, onStopRecording, photoUpload, sendImage}) {
    
  const [sendVoiceNote, setSendVoiceNote] = useState(true);       
  const [showPicker, setShowPicker] = useState(false);
  const [inputStr, setInputStr] = useState('');

  const onEmojiClick = (event, emojiObject) => {
    console.log(emojiObject,'$$$$$$$$$$$');
    setInputStr(prevInput => prevInput + emojiObject.emoji);
    setSendVoiceNote(false)
  };
  const onMessageSend = (e) =>{
    e.preventDefault();
        handleClick(e);
        setInputStr('')
        setShowPicker(false)
        // inputRef.current.value = ''
  }
    return (
<>
{showPicker && 
<div style={{position:'absolute', bottom:'60px'}}>
         <Picker
          pickerStyle={{ width: '30%'}}
          onEmojiClick={onEmojiClick} 
          emojiStyle={'google'}
          />
</div>
}
<Form >
            <div className="box">
                <HiOutlineEmojiHappy onClick={() => setShowPicker(val => !val)} style={{ cursor: 'pointer', fontSize: '30px', color: '#128c7e' }} />                <input
                    ref={inputRef}
                    value={inputStr}
                    className='input_text'
                    id="inp"
                    type="text"
                    placeholder="Enter Text Here..."
                    onKeyDown={(e) => e.key === "Enter" && onMessageSend(e)}
                    onChange={(value) => {value.target.value.length > 0 ? setSendVoiceNote(false) : setSendVoiceNote(true); setInputStr(value.target.value)}}
                    style={{ border: 'none', borderRadius: '20px', outline: 'none', backgroundColor: '#e2dfdf' }}
                />
                <ImgUpload onChange={photoUpload} />
                {!sendVoiceNote || sendImage ?
                    <button onClick={(e)=>onMessageSend(e)} className="btn btn-outline-primry" style={{ width: '80px', border: 'none', borderRadius: '500px', color: 'dodgerblue' }}>
                        <SendRoundedIcon style={{ cursor: 'pointer' }} sx={{ fontSize: '40px', color: '#128c7e' }} ></SendRoundedIcon>
                    </button>
                    :
                    <Record onStopRecording={onStopRecording}></Record>
                }
            </div>
        </Form>
</>
        )
}