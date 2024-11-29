import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPhoneAlt, FaShoppingCart, FaSearch } from 'react-icons/fa';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './Header.css';

const Header = () => {
  const [showTitle, setShowTitle] = useState(false);
  const [showNavLinks, setShowNavLinks] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowTitle(true), 100); // Title delay
    const navTimer = setTimeout(() => setShowNavLinks(true), 500); // Nav-links delay
    return () => {
      clearTimeout(timer);
      clearTimeout(navTimer);
    };
  }, []);

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Products', to: '/products' },
    { label: 'About Us', to: '/about' },
    { label: 'Contact', to: '/contact' },
  ];

  return (
    <header className="header">
      {/* Title Animation */}
      <CSSTransition
        in={showTitle}
        timeout={1000}
        classNames="title"
        unmountOnExit
      >
        <div className="navbar-title">Ecommerce</div>
      </CSSTransition>

      {/* Nav-Links and Icons Animation */}
      <nav className="navbar">
        <div className="navbar-content">
          <TransitionGroup component={null}>
            {showNavLinks &&
              navLinks.map((link, index) => (
                <CSSTransition
                  key={link.label}
                  timeout={1000}
                  classNames="nav-link"
                >
                  <Link
                    to={link.to}
                    className="nav-link-item"
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    {link.label}
                  </Link>
                </CSSTransition>
              ))}
          </TransitionGroup>

          {/* Icons */}
          {showNavLinks && (
            <div className="navbar-icons">
              <Link to="/search" className="icon">
                <FaSearch />
              </Link>
              <Link to="/cart" className="icon">
                <FaShoppingCart />
              </Link>
              <Link to="/contact" className="icon">
                <FaPhoneAlt />
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
