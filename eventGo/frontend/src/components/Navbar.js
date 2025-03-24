import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, connectWallet, disconnectWallet } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleWalletAction = async () => {
    if (user) {
      await disconnectWallet();
    } else {
      await connectWallet();
    }
    closeMobileMenu();
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand" onClick={closeMobileMenu}>
          <img src="/logo.svg" alt="EventGo Logo" />
          EventGo
        </Link>

        <button className="mobile-menu-button" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>

        <div className={`navbar-links ${isMobileMenuOpen ? 'active' : ''}`}>
          <Link
            to="/"
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
            onClick={closeMobileMenu}
          >
            Home
          </Link>
          <Link
            to="/events"
            className={`nav-link ${isActive('/events') ? 'active' : ''}`}
            onClick={closeMobileMenu}
          >
            Events
          </Link>
          <Link
            to="/my-tickets"
            className={`nav-link ${isActive('/my-tickets') ? 'active' : ''}`}
            onClick={closeMobileMenu}
          >
            My Tickets
          </Link>
          <Link
            to="/organizer"
            className={`nav-link ${isActive('/organizer') ? 'active' : ''}`}
            onClick={closeMobileMenu}
          >
            Organizer
          </Link>

          {user ? (
            <>
              <div className="wallet-address">
                <span>Connected:</span>
                {`${user.walletAddress.slice(0, 6)}...${user.walletAddress.slice(-4)}`}
              </div>
              <button
                className="disconnect-wallet-btn"
                onClick={disconnectWallet}
              >
                Disconnect
              </button>
            </>
          ) : (
            <button
              className="wallet-button"
              onClick={handleWalletAction}
              disabled={false}
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;