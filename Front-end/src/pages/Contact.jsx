import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './Contact.css'
import linkedin from '../assets/pic/icons8-linkedin-144.svg'
import github from '../assets/pic/icons8-github-144.svg'


const Contact = () => {
  const [formData, setFormData] = useState({
    email: '', 
    subject: '',
    message: ''
  })

  useEffect(() => {
    authorize()
  },[])

  const authorize = async() => {
    try {
      const auth = await axios.get('http://localhost:3000/authorize')
      console.log('successfully authorized application', auth)
    } catch (err) {
      console.error('Error authorizing application:', err)
    }
  }

  const sendEmail = async(e) => {
    e.preventDefault()
    try {
      const data = await axios.post('http://localhost:3000/send-email', formData)
      console.log('message successfully sent:', data)
    } catch (err) {
      console.error('Error sending message:', err.message)
    }
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
          <input 
            className="inputOne" 
            placeholder="Email Address"
            type="email"
            value={formData.email} 
            onChange={(e) => {
              setFormData({...formData, email: e.target.value})
            }}
          />
          <span className="input-border positionOne"></span>
          <input 
            className="inputTwo" 
            placeholder="Subject" 
            type="text" 
            value={formData.subject} 
            onChange={(e) => {
              setFormData({...formData, subject: e.target.value})
            }}
          />
          <span className="input-border positionTwo"></span>
          <textarea 
            name="para" 
            id="para" 
            className='inputThree' 
            cols="30" 
            rows="10" 
            value={formData.message} 
            onChange={(e) => {
              setFormData({...formData, message: e.target.value})
            }}
          />
          <button className='button-send' onClick={sendEmail}>
              <span>Send</span>
              <svg className='arrow' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 74 74" height="34" width="34">
                  <circle strokeWidth="3" stroke="black" r="35.5" cy="37" cx="37"></circle>
                  <path fill="black" d="M25 35.5C24.1716 35.5 23.5 36.1716 23.5 37C23.5 37.8284 24.1716 38.5 25 38.5V35.5ZM49.0607 38.0607C49.6464 37.4749 49.6464 36.5251 49.0607 35.9393L39.5147 26.3934C38.9289 25.8076 37.9792 25.8076 37.3934 26.3934C36.8076 26.9792 36.8076 27.9289 37.3934 28.5147L45.8787 37L37.3934 45.4853C36.8076 46.0711 36.8076 47.0208 37.3934 47.6066C37.9792 48.1924 38.9289 48.1924 39.5147 47.6066L49.0607 38.0607ZM25 38.5L48 38.5V35.5L25 35.5V38.5Z"></path>
              </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Contact
