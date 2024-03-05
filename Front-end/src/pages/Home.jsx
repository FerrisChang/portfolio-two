import React from 'react'
import './Home.css'
import AboutMe from '../components/Sections/AboutMe'
import SkillWork from '../components/Sections/SkillWork'

const Home = () => {
  return (
    <div id='Home' className='flex-container '>
      <div id='home-info-container' className='flex-container'>
        <h1 className='raleway-bold headings-size home-spacing'>Hello, I'm Ferris.</h1>
        <h1 className='raleway-bold headings-size home-spacing special-font-color'>I'm a Software Developer.</h1>
        <p id='home-support-align' className='raleway-itl home-spacing'>Let my passion for building beautiful and innovative applications 
          <br/>help drive your business success</p>
      </div>
      <AboutMe />
      <SkillWork />
    </div>
  )
}

export default Home
