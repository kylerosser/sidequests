//import { useState } from 'react'
import {
  BrowserRouter as Router,
  Routes, Route, Link
} from 'react-router-dom'
import Home from './components/Home'
import Login from './components/Login'

function App() {

  return (
    <Router>
      <div>
        <Link to="/"><p>Go home! </p></Link>
        <Link to="/login"><p>Login! </p></Link>
      </div>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>

      <div>
        <i>Map app, Department of Computer Science 2024</i>
      </div>
    </Router>
  )
}

export default App
