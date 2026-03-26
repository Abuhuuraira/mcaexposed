import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
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
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/records" element={<Records />} />
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
            <Route path="/courts" element={<Courts />} />
            <Route path="/story" element={<Story />} />
            <Route path="/report" element={<Report />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
