import { doc, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useContext } from 'react';
import { AuthContext } from '../context/authContext';
import { db } from '../firebase';
import { ChatContext } from '../context/chatContext';

const Chats = () => {
  const {data} = useContext(ChatContext);
  const {currentUser} = useContext(AuthContext);
  const {dispatch} =useContext(ChatContext);
  const [chats,setChats] = useState([]);
  useEffect(()=>{
    const getChats = ()=>{
      const unsub = onSnapshot(doc(db,"userChats",currentUser.uid),(doc)=>{
        setChats(doc.data());
      });
      return ()=>{unsub();}
    };
    currentUser.uid && getChats();
  },[currentUser.uid]);
  console.log(Object.entries(chats));

  const handleSelect = (u)=>{
    console.log(u);
    console.log("this");
    dispatch({type:"CHANGE_USER" ,payload:u});

  }
  return (
    <div className='chats'>
      {Object.entries(chats)?.sort((a,b)=>b[1].date-a[1].date).map((chat)=>(
        <div className={`userChat ${data.user.uid === chat[1].userInfo.uid && 'select'}`} key={chat[0]} onClick={()=>{handleSelect(chat[1].userInfo)}}> 
        <img src={chat[1].userInfo.photoURL} alt="" />
        <div className="userChatInfo">
          <span className="name">{chat[1].userInfo.displayName}</span>
          <p>{chat[1].lastMessage?.text}</p>
        </div>
      </div>
      ))}
    </div>
  )
}

export default Chats