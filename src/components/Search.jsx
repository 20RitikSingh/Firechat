import React, { useContext, useState } from 'react'
import { db } from '../firebase';
import { collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { AuthContext } from '../context/authContext';
const Search = () => {
  const [userName,setUserName] = useState("");
  const [user,setUser] = useState(null);
  const [err,setErr] = useState(false);
  const {currentUser} = useContext(AuthContext);

  const handleSearch= async (e)=>{
    const q=query(collection(db,"users"),where("displayName","==",userName));
    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data());
      });
    } catch (error) {
      setErr(true);
    }
    
  };
  const handleKey=(e)=>{
    e.code === "Enter" && handleSearch();
  };
  const handleSelect = async (e)=>{
    //check if group chat exists in db
    const combinedId = currentUser.uid > user.uid ? currentUser.uid + user.uid : user.uid + currentUser.uid ;
    try {
      const res=await getDoc(doc(db,"chats",combinedId));
      if(!res.exists()){
        //create chat in db
        await setDoc(doc(db,"chats",combinedId),{messages:[]});
        
        //create userChats in db for both users
        await updateDoc(doc(db,"userChats",currentUser.uid),{
          [combinedId + ".userInfo"]:{
            uid:user.uid,
            displayName:user.displayName,
            photoURL:user.photoURL
          },
          [combinedId + ".date"]:serverTimestamp(),
        });
        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
      setUser(null);
      setUserName("");
    } catch (error) {
      setUser(null);
      setUserName("");
    }
    
  };
  return (
    <div className='search'>
      <div className="searchForm">
        <input type="text" placeholder='Find a user' onKeyDown={handleKey} onChange={(e)=>setUserName(e.target.value)} value={userName}/>
      </div>
      {err && <span>Something went wrong</span>}
      {user && 
        <div className="userChat" onClick={handleSelect}>
          <img src={user.photoURL} alt="" />
          <div className="userChatInfo">
            <span className="name">{user.displayName}</span>
          </div>
        </div>
      }
      
    </div>
  )
}     

export default Search