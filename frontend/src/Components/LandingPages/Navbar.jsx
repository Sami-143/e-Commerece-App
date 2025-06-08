import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaSearch, FaPhoneAlt } from 'react-icons/fa';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Handle scroll to change navbar background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/contact', label: 'Contact' },
    { to: '/product', label: 'Products' },
    { to: '/about', label: 'About' },
  ];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-colors duration-300 ${
        isScrolled ? 'bg-gray-900 shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto flex justify-between items-center py-6 px-6">
        {/* Left: Logo Text */}
        <div>
          <Link to="/" className="text-2xl font-extrabold tracking-wide text-white hover:text-gray-600">
            ShopEasy
          </Link>
        </div>

        {/* Desktop Links */}
        <nav className="hidden md:flex space-x-12 text-lg text-white">
          {navLinks.map((link, index) => (
            <Link key={index} to={link.to} className="hover:text-gray-200 transition">
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Icons */}
        <div className="hidden md:flex items-center space-x-4 text-white">
          <FaSearch className="text-xl hover:text-gray-200 cursor-pointer transition" />
          <FaShoppingCart className="text-xl hover:text-gray-200 cursor-pointer transition" />
          <FaPhoneAlt className="text-xl hover:text-gray-200 cursor-pointer transition" />
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu Items */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-900 text-white px-6 pb-4">
          <nav className="flex flex-col space-y-4">
            {navLinks.map((link, index) => (
              <Link
                key={index}
                to={link.to}
                onClick={() => setIsMenuOpen(false)}
                className="hover:text-gray-900 transition"
              >
                {link.label}
              </Link>
            ))}
            <div className="flex space-x-4 pt-4 border-t border-gray-900">
              <FaSearch className="text-xl hover:text-gray-300 cursor-pointer transition" />
              <FaShoppingCart className="text-xl hover:text-gray-300 cursor-pointer transition" />
              <FaPhoneAlt className="text-xl hover:text-gray-300 cursor-pointer transition" />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
