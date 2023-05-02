import React, { useState } from 'react'
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate ,Link} from 'react-router-dom';
export const Login = () => {

  const [err,setErr] = useState(false);
  const navigate = useNavigate();
  
  const formSubmit= async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;
    try {
      await signInWithEmailAndPassword(auth, email, password); 
      navigate("/");     
    } catch (error) {
      setErr(true);
    }
  }
  return (
    <div className='formContainer'>
        <div className="formWrapper">
            <span className="logo">Fire Chat</span>
            <span className="title">Login</span>
            <form onSubmit={formSubmit}>
                <input type="email" placeholder='Email'/>
                <input type="password" placeholder='Password' />
                <input type="file" style={{display:"none"}} id="file"/>
                <button>Sign in</button>
                {err && <p>Something went wrong</p>}
                <p>Don't have an acccount? <Link to={"/register"}>Register</Link></p>
            </form>
        </div>
    </div>
  )
}
