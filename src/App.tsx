import React, { useContext, useEffect, useState } from 'react';
import './App.css';
import Pages from './components/NewsPage';
import NavBar from './layouts/Navbar';
import { ThemeContext } from './context/theme';
import Page2 from './components/FirstPage';
import router from './routes/routes';
import { RouterProvider } from 'react-router-dom';
import VisitedSites from './components/cache'; // Import VisitedSites component

function App() {
  const { theme } = useContext(ThemeContext);

  // Define the addVisitedSite function
  const addVisitedSite = (site: string) => {
    // Retrieve existing visited sites from local storage
    const storedVisitedSites = localStorage.getItem('visitedSites');
    let visitedSites = storedVisitedSites ? JSON.parse(storedVisitedSites) : [];

    // Prevent duplicate entries
    if (!visitedSites.includes(site)) {
      visitedSites.push(site);
      // Update local storage with the updated visited sites
      localStorage.setItem('visitedSites', JSON.stringify(visitedSites));
    }
  };

  return (
    <>
      <div
        className={`h-screen w-full mx-auto py-2 ${
          theme === "dark" ? "dark" : ""
        }`}
      >
        <RouterProvider router={router} />
        {/* Pass the addVisitedSite function as a prop to the VisitedSites component */}
        <VisitedSites addVisitedSite={addVisitedSite} />
      </div>
    </>
  );
}

export default App;
