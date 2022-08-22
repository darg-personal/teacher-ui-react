import React, { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Divider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import Fab from "@material-ui/core/Fab";
// import SendIcon from '@material-ui/icons/Send';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  chatSection: {
    width: "100%",
    height: "80vh",
  },
  headBG: {
    backgroundColor: "#e0e0e0",
  },
  borderRight500: {
    borderRight: "1px solid #e0e0e0",
  },
  messageArea: {
    height: "70vh",
    overflowY: "auto",
  },
});

const Chat = () => {
  const classes = useStyles();
  const inputRef = useRef(null);
  const [messages, setMessages] = useState([]);

  function handleClick() {
    console.log(inputRef.current.value);
    ws.send(
      JSON.stringify({
        meta_attributes: "react",
        media_link: "http://www.doogle.com/",
        message_text: inputRef.current.value,
        user: "user1",
      })
    );
  }

  var ws = new WebSocket(
    "ws://localhost:8001/msg/channel/?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjYxMjMwODMyLCJpYXQiOjE2NjExNDQ0MzIsImp0aSI6ImI4YWIxYmUwZWM0YTRkNmFhMzc5MTEzYzczNjdmOTllIiwidXNlcl9pZCI6MX0.QCYl21aEItZoKo898EOd4kkyYp9rT0opqDoJd0PEXpo&roomname=class8"
  );

  useEffect(() => {
    ws.onopen = function open() {
      console.log("web socket connection created!!");
    };
  }, []);

  useEffect(() => {
    ws.onmessage = (evt) => {
      // listen to data sent from the websocket server
      const message = JSON.parse(evt.data);
      // setState({dataFromServer: message})
      const receivedObj = JSON.parse(message);
      const msgObj = {
        sender: receivedObj?.User || "NA",
        message: receivedObj?.message_text || "NA",
      };
      const prevMsgs = [...messages];
      prevMsgs.push(msgObj);
      setMessages([...prevMsgs]);
      // setPrints(message);
      console.log({ messages, prevMsgs, receivedObj });
    };
  }, [messages]);

//   ws.onclose = (evt) => {
//   console.log('The connection has been closed successfully.');
// };

  return (
    <div>
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h5" className="header-message">
            Chat
          </Typography>
        </Grid>
      </Grid>
      <Grid container component={Paper} className={classes.chatSection}>
        <Grid item xs={3} className={classes.borderRight500}>
          <List>
            <ListItem button key="RemySharp">
              <ListItemIcon>
                <Avatar
                  alt="Remy Sharp"
                  src="https://material-ui.com/static/images/avatar/1.jpg"
                />
              </ListItemIcon>
              <ListItemText primary="John Wick"></ListItemText>
            </ListItem>
          </List>
          <Divider />
          <Grid item xs={12} style={{ padding: "10px" }}>
            <TextField
              id="outlined-basic-email"
              label="Search"
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Divider />
          <List>
            <ListItem button key="RemySharp">
              <ListItemIcon>
                <Avatar
                  alt="Remy Sharp"
                  src="https://material-ui.com/static/images/avatar/1.jpg"
                />
              </ListItemIcon>
              <ListItemText primary="Remy Sharp">Remy Sharp</ListItemText>
              <ListItemText secondary="online" align="right"></ListItemText>
            </ListItem>
            <ListItem button key="Alice">
              <ListItemIcon>
                <Avatar
                  alt="Alice"
                  src="https://material-ui.com/static/images/avatar/3.jpg"
                />
              </ListItemIcon>
              <ListItemText primary="Alice">Alice</ListItemText>
            </ListItem>
            <ListItem button key="CindyBaker">
              <ListItemIcon>
                <Avatar
                  alt="Cindy Baker"
                  src="https://material-ui.com/static/images/avatar/2.jpg"
                />
              </ListItemIcon>
              <ListItemText primary="Cindy Baker">Cindy Baker</ListItemText>
            </ListItem>
          </List>
        </Grid>

        {/* Main Chat */}

        <Grid item xs={9}>
          <List className={classes.messageArea}>
            
            <ListItem key="i">
            <Grid container>
              <Grid item xs={12}>
                <ListItemText
                  align="left"
                  primary="Hey, Iam Good! What about you ?"
                ></ListItemText>
              </Grid>
              <Grid item xs={12}>
                <ListItemText align="left" secondary="09:31"></ListItemText>
              </Grid>
            </Grid>
          </ListItem>
            <ListItem key='i'>
            <Grid container>
              <Grid item xs={12}>
                <ListItemText
                  align="right"
                  primary="dfjasgfh asjhdfgksd jhsdgfj"
                ></ListItemText>
              </Grid>
              <Grid item xs={12}>
                <ListItemText
                  align="right"
                  secondary="09:30"
                ></ListItemText>
              </Grid>
            </Grid>
          </ListItem>
          </List>
          <Divider />
          <Grid container style={{ padding: "20px" }}>
            <Grid item xs={11}>
            <input
            ref={inputRef}
            className="input_text"
            id="inp"
            type="text"
            placeholder="Enter Text Here..."
          />
            </Grid>
            <Grid item xs={1} align="right">
              <Fab color="primary" aria-label="add" onClick={handleClick}>
                Send
              </Fab>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default Chat;
