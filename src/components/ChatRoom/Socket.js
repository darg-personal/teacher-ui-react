import React, { Component } from "react";
import utils from "../../pages/auth/utils";
import MainChat from "./MainChat";
import UserChat from "./UserChat";
import Contact from "./Contact";
import UserGroup from "./UserGroup";
import { Navigate } from "react-router-dom";

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
            temp: null,
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
            about: null
        };
    }

    pull_data = (data) => {
        console.log(data,'data in pull data in socket js');
        this.setState({ chatRoom: data.name });
        // tempChatRoomId = data.id;
        this.setState({ chatRoomId: data.id });
        this.setState({ type: data.type });
        this.setState({ show: false });
        this.setState({ image: data.image });
        this.setState({ about: data.about })
        this.check(data.name, data.id, data.type, data.isConnected)
    };
    
    pullReceiveMessageCount = (data) => {
        this.setState({ unreadMessageCountDict: data.unreadMessageCountDict });
        this.setState({ chatroomUniqeId: data.uniqeId });
        this.setState({ userUniqeId: data.userUniqeId });
        
    };
    pullReceiveMessageCountForGroup = (data) =>{
        this.setState({ channelId: data.channelId });
        this.setState({ channelName: data.channelName });
        this.setState({ unreadMessageCountDictForGroup: data.unreadMessageCountDictForGroup });
    }
    //   timeout = 250;

    connect = (cRoom, userId, type, isConnected) => {
        console.log('connect is called....>!');
        this.setState({ temp: null });
        const ws = [];
        if (type == "Channel")
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
            this.setState({ temp: getSocket })
            this.setState({ userStatus: userst })
            this.setState({ isConnected: isConnected })
            //   that.timeout = 250; // reset timer to 250 on open of websocket connection
            //   clearTimeout(connectInterval); // clear Interval on on open of websocket connection
        };

        // getSocket.onclose = (e) => {
        //   console.log(
        //     `Socket is closed. Reconnect will be attempted in ${Math.min(
        //       10000 / 1000,
        //       (that.timeout + that.timeout) / 1000
        //     )} second.`,
        //     e.reason
        //   );
        //   that.timeout = that.timeout + that.timeout; //increment retry interval
        //   connectInterval = setTimeout(this.check, Math.min(10000, that.timeout)); //call check function after timeout
        // };

        // getSocket.onerror = (err) => {
        //   console.error(
        //     "Socket encountered error: ",
        //     err.message,
        //     "Closing socket"
        //   );
        //   getSocket.close();
        // };
    };

    check = (cRoom, id, type, isConnected) => {
        console.log('check is called');
        const { ws, userStatus } = this.state;
        if (cRoom in ws) {
            if (!ws[cRoom] || ws[cRoom].readyState == WebSocket.CLOSED) {
                if (cRoom)
                this.connect(cRoom, id, type, isConnected);
            }
            this.setState({ temp: ws[cRoom] })
            this.setState({ isConnected: userStatus[cRoom] })
        }
        else {
            if (cRoom)
            this.connect(cRoom, id, type, isConnected);
        }
    };
    
    updateGroupinfo = (data) => {
        this.setState({ show: false });
        this.state.userStatus[data.user] = data.isConnected
        this.setState({ isConnected: data.isConnected })
    }
    reDirect = (data) => {
        this.pull_data(data)
    }
    chatMethod = () => {
        if (this.state.show && this.state.isConnected == 0) {
            return <UserGroup name={this.state.chatRoom} chatRoomId={this.state.chatRoomId}
                type={this.state.type} show={this.getUserInfo} image={this.state.image}
                websocket={this.state.temp} updateGrupinfo={this.updateGroupinfo}
                reDirect={this.reDirect} about={this.state.about}
            />
        }
        else {
            if (this.state.type === "Channel" && this.state.temp !== null) {
                return (
                    <MainChat
                        chatRoom={this.state.chatRoom}
                        // chatRoomId={tempChatRoomId}
                        chatRoomId={this.state.chatRoomId}
                        type={this.state.type}
                        websocket={this.state.temp}
                        getChatImage={this.state.image}
                        isConnected={this.state.isConnected}
                        show={this.getUserInfo}
                        receiveMessageCountForGroup={this.pullReceiveMessageCountForGroup}
                    />
                );
            }
            if ((this.state.type === "user") && (this.state.temp !== null)) {
                return (
                    <UserChat
                        userName={this.state.chatRoom}
                        // userId={tempChatRoomId}
                        userId={this.state.chatRoomId}
                        type={this.state.type}
                        websocket={this.state.temp}
                        getChatImage={this.state.image}
                        isConnected={this.state.isConnected}
                        show={this.getUserInfo}
                        receiveMessageCount={this.pullReceiveMessageCount}
                    />
                );
            }
        }
    };

    getUserInfo = (data) => {
        this.setState({ show: data.show });
        if (data.websocket)
            this.setState({ temp: data.websocket })
        this.setState({ chatRoomId: data.chatroomId })
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
                            unreadMessageCountDictForGroup={this.state.unreadMessageCountDictForGroup}
                        />
                        {this.chatMethod()}
                    </div>
                ) : (
                    <Navigate replace to="/login" />
                )}
            </>
        );
    }
}
