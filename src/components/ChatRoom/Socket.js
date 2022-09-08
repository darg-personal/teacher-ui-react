import React, { Component } from "react";
import utils from "../../pages/auth/utils";
import MainChat from "./MainChat";
import UserChat from "./UserChat";
import Contact from "./Contact";
import { Navigate } from "react-router-dom";

let Token = localStorage.getItem("token");


export class Socket extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ws: {},
      chatRoom: "",
      chatRoomId: 1,
      type: 'Channel',
      chatroomObj:[],
      temp:null

    };
  }
  pull_data = (data) => {
    console.log(data,"--- Pull data");

    {
    this.setState({ chatRoom: data.name });
    this.setState({ chatRoomId: data.id });
    this.setState({ type: this.type });
    this.check(data.name)
    // console.log(this.state.chatRoom,'this.state.chatRoom./////');
  }
  };
  // single websocket instance for the own application and constantly trying to reconnect.

  timeout = 250; // Initial timeout duration as a class variable

  /**
   * @function connect
   * This function establishes the connect with the websocket and also ensures constant reconnection if connection closes
   */
  connect = (cRoom) => {
    var ws = new WebSocket(
      `${utils.getWebsocketHost()}/msg/channel/?token=${Token}&roomname=${cRoom}`
    );
    let that = this; // cache the this
    var connectInterval;
    
    // websocket onopen event listener
    ws.onopen = () => {
      var chatroom = cRoom;
      // const wsObj = {}
      // wsObj[chatroom] = ws;
      var wsdict = this.state.ws;
      wsdict[chatroom] = ws;
      this.setState({ ws: wsdict });
      this.setState({temp : ws})
      console.log(ws,'OnOpen');

      that.timeout = 250; // reset timer to 250 on open of websocket connection
      clearTimeout(connectInterval); // clear Interval on on open of websocket connection
    };

    // websocket onclose event listener
    ws.onclose = (e) => {
      console.log(
        `Socket is closed. Reconnect will be attempted in ${Math.min(
          10000 / 1000,
          (that.timeout + that.timeout) / 1000
        )} second.`,
        e.reason
      );

      that.timeout = that.timeout + that.timeout; //increment retry interval
      connectInterval = setTimeout(this.check, Math.min(10000, that.timeout)); //call check function after timeout
    };

    // websocket onerror event listener
    ws.onerror = (err) => {
      console.error(
        "Socket encountered error: ",
        err.message,
        "Closing socket"
      );

      ws.close();
    };

  };

  /**
   * utilited by the @function connect to check if the connection is close, if so attempts to reconnect
   */

  check = (cRoom) => {
    const { ws } = this.state;

      if(cRoom in ws  ){
        if(!ws[cRoom] || ws[cRoom].readyState == WebSocket.CLOSED){
          console.log('connection is closed....!');
          this.connect(cRoom);
        }
      // console.log(ws,'in If');
      this.setState({temp : ws[cRoom]})
    }
      else{
        // console.log(ws,'in Else');
        console.log(' key not exiest' );
        this.connect(cRoom);
      }
  };

  render() {
    return (
      <>
        {Token ? (
          <div className="chatroom">
            <Contact type={this.pull_data} />
            {this.state.temp ?
            <MainChat
              chatRoom={this.state.chatRoom}
              chatRoomId={this.state.chatRoomId}
              type={this.state.type}
              websocket={this.state.temp}
            /> : null}
          </div>
        ) : (
          <Navigate replace to="/login" />
        )}
      </>
    );
  }
}
