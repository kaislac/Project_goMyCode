import React from 'react'
import Router from './Router'
import axios from 'axios'
import { AuthContextProvider } from './context/AuthContext'
import './index.css'
axios.defaults.withCredentials = true

const App = () => {
  return (
    <AuthContextProvider>
      <Router />
    </AuthContextProvider>
  )
}

export default App
