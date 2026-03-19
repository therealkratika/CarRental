import React from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import './Landing.css';
import car from '../assets/car.png';
export default function Landing() {
  const navigate = useNavigate();
  return (
   <div className="landing">
    <div className='Navbar'>
      <Navbar/>
    </div>
    <div className='background-text'>DRIVEOX</div>
    <div className='right'>
    <div className='right-text'>
     <h1>YOUR JOURNEY,</h1>
     <h1>YOUR CAR,</h1>
     <h1>YOUR WAY</h1>
     </div>
     <div className='right-explain'>
       <p>Experience the thrill of driving your perfect car on your perfect journey.</p>
     </div>
     </div>
     <div>
      <button className="explore" onClick={()=>navigate('/signup')}>Explore Now</button>
     </div>
     <div className='car-image'>
      <img src={car} alt="Car" />
     </div>
     <div className='left'>
      <div className='left-text'>
        <h2>12.5k+ people joined</h2>
        <p>Join our community of car enthusiasts and experience the thrill of driving your perfect car on your perfect journey.</p>
      </div>
      <div className='left-button-group'>
        <button className='action-btn'>Rent</button>
        <button className='action-btn'>Rent out</button>
      </div>
     </div>
   </div>
  );
}