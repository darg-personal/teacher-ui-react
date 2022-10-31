import React, { Component } from "react";
import utils from "../../pages/auth/utils";
import MainChat from "./MainChat";
import UserChat from "./UserChat";
import Contact from "./Contact";
import UserGroup from "./UserGroup";
import { Navigate } from "react-router-dom";
import './chatroom.css'
import NoChatView from "../staticfiles/NoChatView";
let Token = localStorage.getItem("token");
// var tempChatRoomId
export class Socket extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ws: {},
      chatRoom: "",
      chatRoomId: 0,
      type: null,
      chatroomObj: [],
      tempWs: null,
      image: null,
      show: false,
      isConnected: true,
      userStatus: {},
      unreadMessageCountDict: {},
      unreadMessageCountDictForGroup: {},
      receiveMessageCount: 0,
      chatroomUniqeId: 0,
      userUniqeId: 0,
      channelId: 0,
      channelName: null,
      about: null,
    };
  }

  pull_data = (data) => {
    console.log(data, "data in pull data in socket js");
    this.setState({ chatRoom: data.name });
    // tempChatRoomId = data.id;
    this.setState({ chatRoomId: data.id });
    this.setState({ type: data.type });
    this.setState({ show: false });
    this.setState({ image: data.image });
    this.setState({ about: data.about });
    this.check(data.name, data.id, data.type, data.isConnected);
  };

  pullReceiveMessageCount = (data) => {
    this.setState({ unreadMessageCountDict: data.unreadMessageCountDict });
    this.setState({ chatroomUniqeId: data.uniqeId });
    this.setState({ userUniqeId: data.userUniqeId });
  };
  pullReceiveMessageCountForGroup = (data) => {
    this.setState({ channelId: data.channelId });
    this.setState({ channelName: data.channelName });
    this.setState({
      unreadMessageCountDictForGroup: data.unreadMessageCountDictForGroup,
    });
  };
  //   timeout = 250;
  connect = (cRoom, userId, type, isConnected) => {
    console.log("connect is called....>!");
    this.setState({ tempWs: null });
    const ws = [];
    if (type === "Channel")
      ws.push(
        new WebSocket(
          `${utils.getWebsocketHost()}/msg/channel/?token=${Token}&roomname=${cRoom}`
        )
      );
    else
      ws.push(
        new WebSocket(
          `${utils.getWebsocketHost()}/msg/user/?token=${Token}&receiver_id=${userId}`
        )
      );
    // let that = this; // cache the this
    // var connectInterval;
    const getSocket = ws[0];
    getSocket.onopen = () => {
      var chatroom = cRoom;
      var wsdict = this.state.ws;
      var userst = this.state.userStatus;
      wsdict[chatroom] = getSocket;
      userst[chatroom] = isConnected;
      this.setState({ ws: wsdict });
      this.setState({ tempWs: getSocket });
      this.setState({ userStatus: userst });
      this.setState({ isConnected: isConnected });
    };

  };

  check = (cRoom, id, type, isConnected) => {
    console.log("check is called");
    const { ws, userStatus } = this.state;
    if (cRoom in ws) {
      if (!ws[cRoom] || ws[cRoom].readyState === WebSocket.CLOSED) {
        if (cRoom) this.connect(cRoom, id, type, isConnected);
      }
      if (type === "user") {
        this.connect(cRoom, id, type, isConnected);
      }
      this.setState({ tempWs: ws[cRoom] });
      this.setState({ isConnected: userStatus[cRoom] });
    } else {
      if (cRoom) this.connect(cRoom, id, type, isConnected);
    }
  };

  updateGroupinfo = (data) => {
    this.setState({ show: false });
    this.state.userStatus[data.user] = data.isConnected;
    this.setState({ isConnected: data.isConnected });
  };
  reDirect = (data) => {
    this.pull_data(data);
  };
  setShowDetail = (data) => {
    this.setState({ show: false });
    if (data.ws) this.setState({ tempWs: data.ws });
  }

  getUserInfo = (data) => {
    console.log(data);
    this.setState({ show: data.show });
    if (data.websocket) this.setState({ tempWs: data.websocket });
    this.setState({ chatRoomId: data.chatroomId });
  };
  chatMethod = () => {
    if (this.state.show && this.state.isConnected === 0) {
      return (
        <UserGroup
          name={this.state.chatRoom}
          chatRoomId={this.state.chatRoomId}
          type={this.state.type}
          show={this.setShowDetail}
          image={this.state.image}
          websocket={this.state.tempWs}
          updateGrupinfo={this.updateGroupinfo}
          reDirect={this.reDirect}
          about={this.state.about}
        />
      );
    } else {
      if (this.state.type === "Channel" && this.state.tempWs !== null) {
        return (
          <MainChat
            chatRoom={this.state.chatRoom}
            chatRoomId={this.state.chatRoomId}
            type={this.state.type}
            websocket={this.state.tempWs}
            getChatImage={this.state.image}
            isConnected={this.state.isConnected}
            show={this.getUserInfo}
            receiveMessageCountForGroup={this.pullReceiveMessageCountForGroup}
          />
        );
      } else {
        if (this.state.type === "user" && this.state.tempWs !== null) {
          return (
            <UserChat
              userName={this.state.chatRoom}
              userId={this.state.chatRoomId}
              type={this.state.type}
              websocket={this.state.tempWs}
              getChatImage={this.state.image}
              isConnected={this.state.isConnected}
              show={this.getUserInfo}
              receiveMessageCount={this.pullReceiveMessageCount}
            />
          );
        }
      }
    }
  };
  render() {
    return (
      <>
        {Token ? (
          <div className="chatroom">
            <Contact
              type={this.pull_data}
              activeUser={this.state}
              receiveMessageCount={this.state.receiveMessageCount}
              chatroomUniqeId={this.state.chatroomUniqeId}
              userUniqeId={this.state.userUniqeId}
              channelId={this.state.channelId}
              channelName={this.state.channelName}
              unreadMessageCountDict={this.state.unreadMessageCountDict}
              unreadMessageCountDictForGroup={
                this.state.unreadMessageCountDictForGroup
              }
            />
            <>
            {this.chatMethod()}
            </>
          </div>
        ) : (
          <Navigate replace to="/login" />
        )}
      </>
    );
  }
}
