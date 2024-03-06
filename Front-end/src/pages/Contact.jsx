import React, { useState } from 'react'
import './Contact.css'
import linkedin from '../assets/pic/icons8-linkedin-144.svg'
import github from '../assets/pic/icons8-github-144.svg'


const Contact = () => {
  const [emailAddress, setEmailAddress] = useState('')
  const [subject, setSubject] = useState('')
  const [para, setPara] = useState('')

  const sendEmail = () => {

  }
  return (
    <div id='Contact'>
      <h2 id='special-title' className='Raleway-bold subheading-font'>Contact</h2>
      <div id='form' className='flex-container'>
        <div id='closer' className='flex-container'>
          <div id='inner-text'>Thank you for taking your time to checking out my portfolio!
          Now that you're all done please feel free to get in contact with me. The form is here for your convince 
          or you can always get in contact with me on any of my socials. Again thank you again for stopping by!
          </div>
          <div className='social-btn-container flex-container'>
            <a href="https://www.linkedin.com/in/changferrisf"><img src={linkedin} alt="Linkedin Icon" className='social'/></a>
            <a href="https://github.com/FerrisChang"><img src={github} alt="Github Icon" className='social'/></a>
          </div>
        </div>
        <div className="inner-form">
          <input className="inputOne" placeholder="Email Address" required="" type="text"/>
          <span className="input-border positionOne"></span>
          <input className="inputTwo" placeholder="Subject" required="" type="text"/>
          <span className="input-border positionTwo"></span>
          <textarea name="para" id="para" className='inputThree' cols="30" rows="10"></textarea>
        </div>
      </div>
    </div>
  )
}

export default Contact
