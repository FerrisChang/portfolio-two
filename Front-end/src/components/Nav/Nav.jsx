import React from 'react'
import './Nav.css'

const Nav = () => {
  return (
    <div className='Nav-bar flex-container'>
      <a href='#Home' className='Nav-btn flex-container'>Home</a>
      <a href='#Projects' className='Nav-btn flex-container'>Projects</a>
      <a href='#Contact' className='Nav-btn flex-container'>Socials</a>
    </div>
  )
}

export default Nav
