import React, { useContext, useState } from "react";
import Img from "../img/img.png";
// import Attach from "../img/attach.png";
import { ChatContext } from "../context/chatContext";
import { AuthContext } from "../context/authContext";
import { Timestamp, arrayUnion, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { db, storage } from "../firebase";
const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);

  const { data } = useContext(ChatContext);
  const { currentUser } = useContext(AuthContext);

  const handleSend = async () => {
    if (img) {
      const storageRef =ref(storage,uuid());
      const uploadTask =uploadBytesResumable(storageRef,img);

      uploadTask.on(
        (error) => {
          console.log("error uploading img");
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(db, "chats", data.chat_id), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img: downloadURL,
              }),
            });
          });
        }
      );

    } else {
      await updateDoc(doc(db, "chats", data.chat_id), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId:currentUser.uid,
          date:Timestamp.now(),
        })
      });
    }
    // console.log("here");
    await updateDoc(doc(db,"userChats",currentUser.uid),{
      [data.chat_id+".lastMessage"]:{text,},
      [data.chat_id+".date"]:serverTimestamp()
    });
    await updateDoc(doc(db,"userChats",data.user.uid),{
      [data.chat_id+".lastMessage"]:{text,},
      [data.chat_id+".date"]:serverTimestamp()
    });
    setText("");
    setImg(null);
  };
  return (
    <div className="input">
      <input
        type="text"
        placeholder="Type something..."
        onChange={(e) => {
          setText(e.target.value);          
        }}
        onKeyDown={(e)=>{
          e.code === "Enter" && handleSend();
        }}
        value={text}
      />
      <div className="send">
        {/* <img src={Attach} alt="" /> */}
        <input
          type="file"
          style={{ display: "none" }}
          id="file"
          onChange={(e) => {
            setImg(e.target.files[0]);
          }}
        />
        <label htmlFor="file">
          <img src={Img} alt="" />
        </label>
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Input;
