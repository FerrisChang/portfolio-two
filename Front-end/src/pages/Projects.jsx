import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './Projects.css'

const Projects = () => {
  const [projects, setProjects] = useState([])

  useEffect(() => {
    getProjects()
  }, [])

  const getProjects = async() => {
    try {
      const pro = await axios.get('http://localhost:3000/project')
      setProjects(pro.data)
    } catch (err) {
      console.error('Client side error fetching project data', err.message)
    }
  }

  return (
    <div id='Projects'>
      <h2 id='special-project-format' className='subheading-font'>Projects</h2>
      <div id='project-container' className='flex-container'>
        {projects.map((item, index) => (
          <a href={item.url} key={index} id='cards'>
            <div id='big-container' className='flex-container'>
              <img id='pro-img' src={item.img} alt="project image" /> 
              <div id='inner-con' className='flex-container'>
                <div id='pro-name' className='raleway-bold'>{item.name}</div>
                <p id='pro-desc'>{item.desc}</p>
                <div id='pro-con' className='flex-container'>
                  {
                    item.tools.map((tool, ind) => (
                      <span id='tool-name' key={ind}>{tool}</span>
                    ))
                  }
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}

export default Projects
