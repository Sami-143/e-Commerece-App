import React from 'react'
import { Fragment } from 'react'
import { CgMouse } from 'react-icons/cg'
import './Home.css'

const Home = () => {
  return <Fragment>
    <div className="banner">
        <p>Welcome to the Home Page</p>
        <h1>Finding the amazing Products</h1>

        <a href='#container'>
            <button>Scroll <CgMouse/></button>
        </a>
    </div>

    <h2 className='homeHeading'>Featured Products</h2>
  </Fragment>
}

export default Home
