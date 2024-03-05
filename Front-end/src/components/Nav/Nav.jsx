import React, { useEffect, useState } from 'react'
import './Nav.css'

const Nav = () => {
  const [scrollPosition, setScrollPosition] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY
      setScrollPosition(position)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])


  return (
    <div className='Nav-bar flex-container' 
    id={scrollPosition > 0 ? 'scrollStyle' : 'fixedStyle'}>
      <a href='#Home' className='Nav-btn flex-container'>Home</a>
      <a href='#Projects' className='Nav-btn flex-container'>Projects</a>
      <a href='#Socials' className='Nav-btn flex-container'>Socials</a>
      <a href='#Contact' className='Nav-btn flex-container'>Contact</a>
    </div>
  )
}

export default Nav
