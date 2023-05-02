import React, { useState } from 'react'
import Add from "../img/addAvatar.png"
import { auth , storage,db} from '../firebase';
import {ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {createUserWithEmailAndPassword , updateProfile} from 'firebase/auth';
import { doc, setDoc } from "firebase/firestore"; 
import { useNavigate ,Link} from 'react-router-dom';
export const Register = () => {
  
  const [err,setErr] = useState(false);
  const navigate = useNavigate();

  const formSubmit= async (e) => {
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const avatar = e.target[3].files[0];
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      const storageRef = ref(storage, displayName);

      const uploadTask = uploadBytesResumable(storageRef, avatar);

      // Register three observers:
      // 1. 'state_changed' observer, called any time the state changes
      // 2. Error observer, called on failure
      // 3. Completion observer, called on successful completion
      uploadTask.on('state_changed', 
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
            default:
              break;
          }
        }, 
        (error) => {
          // Handle unsuccessful uploads
        }, 
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async(downloadURL) => {
            await updateProfile(res.user,{displayName,photoURL:downloadURL});
            await setDoc(doc(db, "users", res.user.uid), {
              uid: res.user.uid,
              displayName,
              email,
              photoURL: res.user.photoURL
            });
            await setDoc(doc(db, "userChats", res.user.uid),{})
            navigate("/");
          });
        }
      );
      
    } catch (error) {
      setErr(true);
    }
  }
  

  return (
    <div className='formContainer'>
        <div className="formWrapper">
            <span className="logo">Fire Chat</span>
            <span className="title">Register</span>
            <form onSubmit={formSubmit}>
                <input type="text" placeholder='Display name' />
                <input type="email" placeholder='Email'/>
                <input type="password" placeholder='Password' />
                <input type="file" style={{display:"none"}} id="file"/>
                <label htmlFor="file">
                    <img src={Add} alt="add avatar" />
                    <span>Add an avatar</span>
                </label>
                <button>Sign Up</button>
                {err && <p>Something went wrong</p>}
                <p>Do you have an acccount? <Link to={"/login"}>Login</Link></p>
            </form>
        </div>
    </div>
  )
}
