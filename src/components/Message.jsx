import React, { useContext, useEffect, useRef } from "react";
import { ChatContext } from "../context/chatContext";
import { AuthContext } from "../context/authContext";

const Message = ({ message }) => {
  const { data } = useContext(ChatContext);
  const { currentUser } = useContext(AuthContext);

  const ref = useRef();
  useEffect(() => {
    ref.current?.scrollIntoView({ behaviour: "smooth" });
  }, [message]);

  return (
    <div
      className={`message ${message.senderId === currentUser.uid && "owner"}`}
      ref={ref}
    >
      <div className="messageInfo">
        <img
          src={
            message.senderId === currentUser.uid
              ? currentUser.photoURL
              : data.user.photoURL
          }
          alt=""
        />
        <span>just now</span>
      </div>
      <div className="messageContent">
        {((!message.img) &&  <p>{message.text}</p>)|| message.img && message.text && <p>{message.text}</p>}
        {message.img && <img src={message.img} alt="" />}
      </div>
    </div>
  );
};

export default Message;
