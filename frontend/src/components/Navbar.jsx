import './Navbar.css';
export default function Navbar(){
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
          <button className="login">Login</button>
          <button className="signup">Sign Up</button>
        </div>
    </div >
 )
}