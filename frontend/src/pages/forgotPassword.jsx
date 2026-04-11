import{useState} from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import {auth} from '../firebase';
import { Link } from "react-router-dom";
import './Auth.css';
export default function ForgotPassword(){
    const [email, setEmail] = useState("");
    const [message,setMessage] = useState("");
    const handleReset = async(e)=>{
        e.preventDefault();
        try{
            await sendPasswordResetEmail(auth,email);
            setMessage("Password resent email sent!");
        }catch(err){
            setMessage(err.message);
        }
    }
    return(
        <div className="auth-wrapper">

  <div className="auth-card">
    <form className="forgot-form" onSubmit={handleReset}>
      <h2>Forgot Password</h2>

      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <button type="submit" className="primary-btn">
        Reset Password
      </button>

      {message && <p className="message">{message}</p>}
    </form>
    <p className="switch-text">
              Back to login? <Link to="/login">Sign in</Link>
            </p>
  </div>

</div>
    );
}