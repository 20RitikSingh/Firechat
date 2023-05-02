import { signOut } from "firebase/auth";
import React, { useContext } from "react";
import { auth } from "../firebase";
import { AuthContext } from "../context/authContext";
import { ChatContext } from "../context/chatContext";

const Navbar = () => {
  const {dispatch} =useContext(ChatContext);
  const { currentUser } = useContext(AuthContext);
  return (
    <div className="navbar">
      <span className="logo">Fire Chat</span>
      <div className="user">
        <img src={currentUser.photoURL} alt="" className="profile" />
        <span className="username">{currentUser.displayName}</span>
        <button onClick={
          () => {
            signOut(auth);
            dispatch({type:"CHANGE_USER" ,payload:{}});
          }
          }>logout</button>
      </div>
    </div>
  );
};

export default Navbar;
