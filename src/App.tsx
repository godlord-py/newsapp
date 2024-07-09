import React, { useContext, useEffect, useState } from 'react';
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
import SignInPage from './components/signin/Signin';
import ProtectedRoute from './layouts/ProtectedRoute';
import NewsWorld from './components/newstwo';
import AddJobForm from './components/Dashboard/AddJob';

function App() {
  const { theme } = useContext(ThemeContext);
  const isMobile = window.innerWidth < 640;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem('authToken');
      setIsLoggedIn(!!token);
      setLoading(false);
    };

    checkAuthStatus();
  }, []);
  if (loading) {
    return <div>Loading...</div>;
  }

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
            <Route 
          path="/admin" 
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
            <AdminForm setIsLoggedIn={setIsLoggedIn} />
          </ProtectedRoute>
          } 
        />
            <Route path='/livenews' element={<NewsFeed/>} />
            <Route path='/job' element={<JobDetails/>} />
            <Route path= '/job/:id' element={<JobDetails/>} />
            <Route path= '/signin' element={<SignInPage setIsLoggedIn={setIsLoggedIn}/>} />
            <Route path='/lv' element= {<NewsWorld/>} />
            <Route path='/addjob' element= {<AddJobForm onJobAdded={undefined}/>} />
          </Routes>
          <Footer />
          {isMobile && <BottomNavigator />}
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
