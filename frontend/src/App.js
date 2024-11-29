import './App.css';
import Header from './Component/layout/Header/Header.js';
import Footer from './Component/layout/Footer/Footer.js';
import { BrowserRouter as Router } from 'react-router-dom';
import React from 'react';

function App() {
  return (
    <Router>
      <div className="App">
        <Header/>
        <Footer/>
      </div>
    </Router>
  );
}

export default App;
