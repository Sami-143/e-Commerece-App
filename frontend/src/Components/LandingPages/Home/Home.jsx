import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import bgImage from '../../../assets/background-image.jpg';
import Navbar from '../Navbar'; // Make sure this is the updated dynamic Navbar

const Home = () => {
  const [navBg, setNavBg] = useState("bg-transparent");
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/login');
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setNavBg("bg-black bg-opacity-80 shadow-md");
      } else {
        setNavBg("bg-transparent");
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center relative"
      style={{ backgroundImage: `url(${bgImage})` }}
      id="home"
    >
      {/* Dynamic Navbar based on scroll */}
      <Navbar navBg={navBg} navLinkColor="text-black" />

      <Helmet>
        <title>My New Shop | Best Deals Online</title>
      </Helmet>

      {/* Main Text Section */}
      <div className="bg-black bg-opacity-60 rounded-2xl p-10 max-w-2xl text-center shadow-xl z-10">
        <h1 className="text-5xl font-bold text-blue-400 mb-4">
          Welcome to My New Shop
        </h1>
        <p className="text-lg text-white mb-8">
          Discover the best products at unbeatable prices. <br />
          Shop now and experience convenience like never before.
        </p>

        <button
          onClick={handleGetStarted}
          className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-xl font-semibold transition duration-300"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Home;
