import { useContext, useState } from 'react'
import './App.css'
import React from 'react'
import Pages from './components/Page'
import NavBar from './layouts/Navbar'
import { ThemeContext } from './context/theme'
import Page2 from './components/Page2'
import router from './routes/routes'
import { RouterProvider } from 'react-router-dom'
function App() {
  const { theme } = useContext(ThemeContext);
  return (
    <>
      <div
      className={`h-screen w-full mx-auto py-2 ${
        theme === "dark" ? "dark" : ""
      }`}>
          <RouterProvider router={router} />
        </div>
    </>
  )
}

export default App
