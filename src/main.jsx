import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
// MOTORU ÇAĞIR
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  // Appİ Motorun İçine At
  <BrowserRouter>
    <App />
  </BrowserRouter>,
)