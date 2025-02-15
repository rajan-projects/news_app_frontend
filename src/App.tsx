import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'

// Components
import Navbar from './components/Navbar'

// Pages
import Home from './pages/Home'
import News from './pages/News'
import NewsDetail from './pages/NewsDetail'

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
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
