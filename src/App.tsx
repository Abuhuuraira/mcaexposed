import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import Navbar from './components/Navbar'
import ScrollToTop from './components/ScrollToTop'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'
import Home from './pages/Home'
import About from './pages/About'
import Courts from './pages/Courts'
import Story from './pages/Story'
import Report from './pages/Report'
import Faq from './pages/Faq'
import Records from './pages/Records'
import Dashboard from './pages/Dashboard'
import PostDetail from './pages/PostDetail'
import Login from './pages/Login'
import './App.css'

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/the-records" element={<Records />} />
              <Route path="/the-records/:category" element={<Records />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/post/:slug" element={<PostDetail />} />
              <Route path="/the-courts" element={<Courts />} />
              <Route path="/the-story" element={<Story />} />
              <Route path="/report-mca-fraud" element={<Report />} />
              <Route path="/mca-frequently-asked-questions-legal-guide" element={<Faq />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </main>
        </BrowserRouter>
      </AuthProvider>
    </HelmetProvider>
  )
}

export default App
