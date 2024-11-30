import './App.css';
import Header from './Component/layout/Header/Header.js';
import Footer from './Component/layout/Footer/Footer.js';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import WebFont from "webfontloader";
import React from 'react';
import Home from './Component/Home/Home.js';

function App() {

  React.useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"],
      },
    });
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route exact path="/" element={<Home />} />
        </Routes>
        <Header />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
