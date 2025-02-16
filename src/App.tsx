import React from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'

// Components
import Navbar from './components/Navbar'
import './components/Navbar.css'

// Pages
import Home from './pages/Home'
import News from './pages/News'
import NewsDetail from './pages/NewsDetail'
import SignIn from './pages/auth/SignIn'
import SignUp from './pages/auth/SignUp'
import './pages/auth/Auth.css'

const App: React.FC = () => {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/news" element={<News />} />
            <Route path="/news/:id" element={<NewsDetail />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
