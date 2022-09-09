// shifted to new dir Socket.js


// import React, { useState } from "react";
// import { Navigate } from "react-router-dom";
// import Contact from "./Contact";
// import MainChat from "./MainChat";
// import UserChat from "./UserChat";
// import utils from "../../pages/auth/utils";
// const Token = localStorage.getItem("token");

// function ChatRoom() {
//   const [chatRoom, setChatRoom] = useState();
//   const [chatRoomId, setChatRoomId] = useState();
//   const [receiveMessage, setReceiveMessage] = useState();
//   const [type, setType] = useState(); 
//   const [queue, setQueue] = useState([]);
//   const [ws, setWs] = useState({}) 
//   localStorage.setItem("queue",queue)

//   const pull_data = (data) => {
//     console.log('----------data----------',data);
//     setChatRoom(data.name);
//     setChatRoomId(data.id);
//     setType(data.type); 
//     check(data.name)
//   };

//   const connect = () => {
//     // console.log(chatR);
//     var ws = new WebSocket(
//       `${utils.getWebsocketHost()}/msg/channel/?token=${Token}&roomname=${chatRoom}`
//     );

    
//     // websocket onopen event listener
//     ws.onopen = () => {
//       var chatroom = chatRoom;
//       // const wsObj = {}
//       // wsObj[chatroom] = ws;
//       var wsdict = ws;
//       wsdict[chatroom] = ws;
//       setWs(wsdict);

//       console.log(ws,'1234567890987654wq');

//       // that.timeout = 250; // reset timer to 250 on open of websocket connection
//       // clearTimeout(connectInterval); // clear Interval on on open of websocket connection
//     };
//   };

//   const check = (cRoom) => {
//     // const { ws } = this.state;

//       if(cRoom in ws  ){
//         if(!ws[cRoom] || ws[cRoom].readyState == WebSocket.CLOSED){
//           connect();
//           console.log('connection is closed....!');
//         }
//       // console.log(ws,'in If');
//       console.log(' key exiest' );
//     }
//       else{
//         // console.log(ws,'in Else');
//         console.log(' key not exiest' );
//         connect();
//       }
//   };

//   const receiveMessages = (data) =>{
//     setReceiveMessage(data.receiveMessageCount)
//     console.log(data.receiveMessageCount,'.........data');
//   }

//   return (
//     <>
//       {Token ? (
//         <div className="chatroom">
//           {/* <Contact type={pull_data} /> */}
//           {true ? (
//             <MainChat chatRoom={chatRoom} chatRoomId={chatRoomId} type={type}/>
//           ) : type == "user" ? (
//             <UserChat userName={chatRoom} userId={chatRoomId} type={type} />
//           ) : null}
//         </div>
//       ) : (
//         <Navigate replace to="/login" />
//       )}
//     </>
//   );
// }

// export default ChatRoom;
