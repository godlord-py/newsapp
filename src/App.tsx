import React, { useContext } from 'react';
import './App.css';
import { ThemeContext } from './context/theme';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import Pages from './components/NewsPage';
import FirstPage from './components/FirstPage'; 
import NotFound from './components/NotFound';
import JobsLayout from './components/Jobs'; 
import Footer from './components/footer';
import NavBar from './layouts/Navbar';
import BottomNavigator from './components/UI/MobileNavigator';
import AdminForm from './components/admin';
import NewsFeed from './components/LatestNews';
import JobDetails from './components/JobAPI';

function App() {
  const { theme } = useContext(ThemeContext);
  const isMobile = window.innerWidth < 640;
  return (
    <>
      <div
        className={`h-screen w-full mx-auto py-2  ${
          theme === 'dark' ? 'dark' : ''
        }`}
      >
        <BrowserRouter>
          <NavBar />
          <Routes>
            <Route path="/" element={<FirstPage/>} />
            <Route path="/pages" element={<Pages />} />
            <Route path="/jobs" element={<JobsLayout />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/admin" element={<AdminForm />} />
            <Route path='/livenews' element={<NewsFeed/>} />
            <Route path='/job' element={<JobDetails/>} />
          </Routes>
          <Footer />
          {isMobile && <BottomNavigator />}
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
