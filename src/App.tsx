import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import About from './pages/About'
import Courts from './pages/Courts'
import Story from './pages/Story'
import Report from './pages/Report'
import Faq from './pages/Faq'
import Records from './pages/Records'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/records" element={<Records />} />
          <Route path="/courts" element={<Courts />} />
          <Route path="/story" element={<Story />} />
          <Route path="/report" element={<Report />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App
