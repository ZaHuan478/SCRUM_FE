import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AuthPage from './page/AuthPage'
import SignupPage from './page/SignupPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
