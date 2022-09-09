import React, { Component } from "react";
import utils from "../../pages/auth/utils";
import MainChat from "./MainChat";
import UserChat from "./UserChat";
import Contact from "./Contact";
import { Navigate } from "react-router-dom";
import { AiFillCodeSandboxSquare } from "react-icons/ai";
import UserGroup from "./UserGroup";
import Avatar from "../../assets/Images/avatar.svg";

let Token = localStorage.getItem("token");
export class Socket extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ws: {},
            chatRoom: "",
            chatRoomId: null,
            type: null,
            chatroomObj: [],
            temp: null,
            image: null ,
            show: false
        };
    }

    pull_data = (data) => {
        this.setState({ chatRoom: data.name });
        this.setState({ chatRoomId: data.id });
        this.setState({ type: data.type });
        this.setState({ show: false });
        this.setState({ image: data.image });

        this.check(data.name, data.id, data.type)
    };

    timeout = 250;

    connect = (cRoom, userId, type) => {
        this.setState({ temp: null })
        const ws = []
        if (type == 'Channel')
            ws.push(new WebSocket(
                `${utils.getWebsocketHost()}/msg/channel/?token=${Token}&roomname=${cRoom}`
            ))
        else
            ws.push(new WebSocket(
                `${utils.getWebsocketHost()}/msg/user/?token=${Token}&receiver_id=${userId}`
            ))
        let that = this; // cache the this
        var connectInterval;
        const getSocket = ws[0]
        getSocket.onopen = () => {
            var chatroom = cRoom;
            var wsdict = this.state.ws;
            wsdict[chatroom] = getSocket;
            this.setState({ ws: wsdict });
            this.setState({ temp: getSocket })
            that.timeout = 250; // reset timer to 250 on open of websocket connection
            clearTimeout(connectInterval); // clear Interval on on open of websocket connection
        };

        getSocket.onclose = (e) => {
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

        getSocket.onerror = (err) => {
            console.error(
                "Socket encountered error: ",
                err.message,
                "Closing socket"
            );
            getSocket.close();
        };
    };

    check = (cRoom, id, type) => {
        const { ws } = this.state;
        if (cRoom in ws) {
            if (!ws[cRoom] || ws[cRoom].readyState == WebSocket.CLOSED) {
                if (cRoom)
                    this.connect(cRoom, id, type);
            }
            this.setState({ temp: ws[cRoom] })
        }
        else {
            console.log(' key not exiest');
            if (cRoom)
                this.connect(cRoom, id, type);
        }
    };

    chatMethod = () => {
        if (this.state.show) {
           return <UserGroup name={this.state.chatRoom} chatRoomId={this.state.chatRoomId} type={this.state.type} show={this.getUserInfo} image={this.state.image}/>
        }
        else {
            if (this.state.type === 'Channel' & this.state.temp !== null) {
                return (<MainChat
                    chatRoom={this.state.chatRoom}
                    chatRoomId={this.state.chatRoomId}
                    type={this.state.type}
                    websocket={this.state.temp}
                    getChatImage={this.state.image}
                    show={this.getUserInfo}
                    
                />)
            }
            if (this.state.type === 'user' & this.state.temp !== null) {
                return (<UserChat
                    userName={this.state.chatRoom}
                    userId={this.state.chatRoomId}
                    type={this.state.type}
                    websocket={this.state.temp}
                    getChatImage={this.state.image}
                    show={this.getUserInfo}
                />)
            }
        }
    }

    getUserInfo = (data) => {
        this.setState({ show: data.show });
    };
    
    render() {
        return (
            <>
                {Token ? (
                    <div className="chatroom">
                        <Contact type={this.pull_data} />
                        {this.chatMethod()}
                    </div>
                ) : (
                    <Navigate replace to="/login" />
                )}
            </>
        );
    }
}
