import{useState} from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import {auth} from '../firebase';
export default function ForgotPassword(){
    const [email, setEmail] = useState("");
    const [message,setMessage] = useState("");
    const handleReset = async(e)=>{
        e.prevcventDefault();
        try{
            await sendPasswordResetEmail(auth,email);
            setMessage("Password resent email sent!");
        }catch(err){
            setMessage(err.message);
        }
    }
    return(
        <div className="container">
            <form className="forgot-form" onSubmit={handleReset}>
                <h2>Forgot Password</h2>
                <input
                 type ="email"
                 placeholder="Enter your email"
                 value = {email}
                 onChange={(e)=> setEmail(e.target.value)}
                 required
                />
                <button type= "submit">Resent Password</button>
                {message && <p className="message">{message}</p>}
            </form>
        </div>
    );
}