import { useContext, useState } from 'react'
import './App.css'
import React from 'react'
import Pages from './components/Page'
import NavBar from './layouts/Navbar'
import { ThemeContext } from './context/theme'
import Page2 from './components/Page2'
function App() {
  const { theme } = useContext(ThemeContext);
  return (
    <>
      <div
      className={`h-screen w-full mx-auto py-2 ${
        theme === "dark" ? "dark" : ""
      }`}>
        <NavBar/>
        <Page2/>
        <Pages/>
        </div>
    </>
  )
}

export default App
