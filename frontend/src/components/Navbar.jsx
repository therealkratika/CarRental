import './Navbar.css';
import { useNavigate } from 'react-router-dom';
export default function Navbar(){
    const navigate = useNavigate();
 return(
    <div className="Wrapper">
        <div className="Title">DRIVOXE</div>
        <div className="list">
            <ul>
                <li>Home</li>
                <li>About</li>
                <li>Contact</li>
            </ul>
        </div>
        <div className="button">
          <button className="login" onClick={()=>navigate('/login')}>Login</button>
          <button className="signup" onClick={()=>navigate('/signup')}>Sign Up</button>
        </div>
    </div >
 )
}