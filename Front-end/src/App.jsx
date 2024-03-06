import './App.css'
import Nav from './components/Nav/Nav'
import Footer from './components/Footer/Footer'
import Home from './pages/Home'
import Projects from './pages/Projects'
import Socials from './components/Social/Socials'
import Contacts from './pages/Contact'


function App() {
  return (
    <div className='App-container flex-container'>
      <Nav />
      <Home />
      <Projects />
      <Contacts />
      <Footer />
    </div>
  )
}

export default App
