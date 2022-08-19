import React from "react";

function ChatMessage(props) {
  return (
    <>
{
  props.msg == ''?
  null :
  <div className="container">
  <img
    src="https://www.w3schools.com/howto/img_avatar.png"
    alt="Avatar"
  />
  <span className="name">Sanjay</span>
  <p>{props.msg}</p>

  <span className="time-right">11:00</span>
</div>

}
    </>
  );
}

export default ChatMessage;
