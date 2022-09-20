import React, { Component } from "react";
import utils from "../../pages/auth/utils";
import MainChat from "./MainChat";
import UserChat from "./UserChat";
import Contact from "./Contact";
import { AiFillCodeSandboxSquare } from "react-icons/ai";
import UserGroup from "./UserGroup";
import Avatar from "../../assets/Images/avatar.svg";
import { Navigate } from "react-router-dom";

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
            image: null,
            show: false,
            isConnected: true,
            userStatus: {}
        };
    }

    pull_data = (response) => {
        let data = response
        console.log({data});
        this.setState({ chatRoom: data.name });
        this.setState({ chatRoomId: data.id });
        this.setState({ type: data.type });
        this.setState({ show: false });
        this.setState({ image: data.image });
        this.check(data.name, data.id, data.type, data.isConnected)
    };

    timeout = 250;

    connect = (cRoom, userId, type, isConnected) => {
        this.setState({ temp: null})
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
            var userst = this.state.userStatus;
            wsdict[chatroom] = getSocket;
            userst[chatroom] = isConnected;
            this.setState({ ws: wsdict });
            this.setState({ temp: getSocket })
            this.setState({ userStatus : userst })
            this.setState({ isConnected: isConnected })

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

    check = (cRoom, id, type, isConnected) => {
        const { ws, userStatus } = this.state;
        console.log(ws, userStatus, "---0",isConnected);
        if (cRoom in ws) {
            if (!ws[cRoom] || ws[cRoom].readyState == WebSocket.CLOSED) {
                if (cRoom)
                    this.connect(cRoom, id, type);
            }
            this.setState({ temp: ws[cRoom] })
            this.setState({ isConnected: userStatus[cRoom] })
        }
        else {
            console.log(' key not exiest');
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
        if (this.state.show && this.state.isConnected == 1) {
            return <UserGroup name={this.state.chatRoom} chatRoomId={this.state.chatRoomId}
                type={this.state.type} show={this.getUserInfo} image={this.state.image}
                websocket={this.state.temp} updateGrupinfo={this.updateGroupinfo}
                reDirect={this.reDirect}
            />
        }
        else {
            if (this.state.type === 'Channel' & this.state.temp !== null) {
                return (<MainChat
                    chatRoom={this.state.chatRoom}
                    chatRoomId={this.state.chatRoomId}
                    type={this.state.type}
                    websocket={this.state.temp}
                    getChatImage={this.state.image}
                    isConnected={this.state.isConnected}
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
                    isConnected={this.state.isConnected}
                    show={this.getUserInfo}
                />)
            }
        }
    }

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
                        <Contact type={this.pull_data} activeUser={this.state} />
                        {this.chatMethod()}
                    </div>
                ) : (
                    <Navigate replace to="/login" />
                )}
            </>
        );
    }
}
