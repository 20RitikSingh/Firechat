import React, { useContext, useEffect, useState } from 'react'
import Message from './Message'
import { ChatContext } from '../context/chatContext';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
const Messages = () => {
  const [messages,setMessages] = useState([]);
  const {data} = useContext(ChatContext);

  useEffect(()=>{
    const unSub = onSnapshot(doc(db,"chats",data.chat_id),(doc)=>{
      doc.exists()&&setMessages(doc.data().messages );
    });
    return ()=>{unSub();}
  },[data.chat_id])

  return (
    <div className='messages'>
      {messages.map((m)=>(
        <Message message={m} key={m.id}/>
      )
      )}
    </div>
  )
}

export default Messages