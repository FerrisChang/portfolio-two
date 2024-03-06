import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './Projects.css'

const Projects = () => {
  const [projects, setProjects] = useState([])

  useEffect(() => {
    getProjects()
  }, [])

  console.log(projects)
  const getProjects = async() => {
    try {
      const pro = await axios.get('http://localhost:3000/project')
      setProjects(pro.data)
      console.log('Successfully fetched projects')
    } catch (err) {
      console.error('Client side error fetching project data', err.message)
    }
  }

  return (
    <div id='Projects'>
      <h2 id='special-project-format' className='subheading-font'>Projects</h2>
      <div id='project-container'>
        {projects.map((item, index) => (
          <div key={index}>
            <img src={item.img} alt="project image" />
            
          </div>
        ))}
      </div>
    </div>
  )
}

export default Projects
