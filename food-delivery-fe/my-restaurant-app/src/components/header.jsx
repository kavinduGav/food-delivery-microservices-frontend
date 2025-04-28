import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './header.css';  // updated styles
import logo from './NayanaPharmaLogo.png';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <header className="nav-top">
      <div className="nav-content container-fluid d-flex align-items-center justify-content-between">
        <Link to='/' className="logo-container d-flex align-items-center">
          <img src={logo} alt="Nayana Pharma Logo" className="logo" />
          <span className="site-name ms-2">Nayana Pharma</span>
        </Link>
        <nav>
          <ul className='nav-links d-flex align-items-center mb-0'>
            <li><Link to='/'>About</Link></li>
            <li><Link to='/submitFeedback'>Add Feedback</Link></li>
            <li><Link to='/MyFeedback'>My Feedback</Link></li>
            <li>
              <Link to='/profile'>
                {currentUser ? (
                  <img src={currentUser.profilePicture} alt='Profile' className='profile-img' />
                ) : (
                  'Sign In'
                )}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )}