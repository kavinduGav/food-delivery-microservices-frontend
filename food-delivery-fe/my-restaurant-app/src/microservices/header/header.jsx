import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './header.css';  // updated styles
import logo from './restaurant-food.avif';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <header className="nav-top">
      <div className="nav-content container-fluid d-flex align-items-center justify-content-between">
        <Link to='/' className="logo-container d-flex align-items-center">
          <img src={logo} alt="Nayana Pharma Logo" className="logo" />
          <span className="site-name ms-2"></span>
        </Link>
        <nav>
          <ul className='nav-links d-flex align-items-center mb-0'>
            <li><Link to='/'>Home</Link></li>
            <li><Link to='/DiliveryDetailsProfile'>My dilivers</Link></li>
         
          </ul>
        </nav>
      </div>
    </header>
  )}