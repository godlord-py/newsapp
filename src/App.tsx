import React, { useContext} from 'react';
import './App.css';
import { ThemeContext } from './context/theme';
import router from './routes/routes';
import { RouterProvider } from 'react-router-dom';
import VisitedSites from './components/cache'; // Import VisitedSites component
import Footer from './components/footer';
import Jobs from './components/Jobs';
import NavBar from './layouts/Navbar';

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
         <NavBar/>
        <RouterProvider router={router} />  
        <Footer/>  
      </div>
    </>
  );
}

export default App;