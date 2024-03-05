import React, { useState } from 'react'
import './SkillWork.css'
import document from '../../assets/skills.json'

const SkillWork = () => {
  const [skills, setSkills] = useState([])
  const [work, setWork] = useState([])
  const parsedSkills = document.skills
  const parsedWork = document.work
  
  useState(() => {
    try {
      setSkills(parsedSkills)
      setWork(parsedWork)
    } catch (err) {
      console.error('Error fetching document', err.message)
    }
  },[])

  return ( 
    <div id='SkillWork-Section' className='flex-container'>
      <h2 id='special-title-format' className='subheading-font'>Skills</h2>
      <div id='skill-container' className='flex-container'>
        {skills.map((item, index) => (
          <div id='skills' className='flex-container' key={index}>
            {item}
          </div>          
        ))}
      </div>
      <h2 id='special-work-format' className='subheading-font'>Experience</h2>
      <div id='experience-container' className='flex-container'>
        {work.map((item, index) => (
          <div id='experience' className='flex-container' key={index}>
            <div>{item.year}</div>
            <div>
              <div>
                <div>
                  {item.title}
                </div>
                <div>
                  {item.company}
                </div>
              </div>
              <div>
                <div>{item.desc}</div>
                <div>
                  {item.skills.map((element, idx) => (
                  <p key={idx}>{element}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SkillWork
