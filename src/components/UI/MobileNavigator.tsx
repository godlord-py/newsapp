import React from 'react';
import { Link } from 'react-router-dom';
import { GiNewspaper } from "react-icons/gi";
import { FaSuitcase } from "react-icons/fa";
import { GoHome } from "react-icons/go";

const BottomNavigator = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth" 
    });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg z-10">
      <div className="flex justify-around items-center py-2">
        <Link to="/" className="flex flex-col items-center text-gray-600 dark:text-gray-300 hover:text-blue-500 transition-colors"  onClick={scrollToTop}>
        <GoHome className='text-2xl'/>
          <span className="text-sm font-semibold">Home</span>
        </Link>

        <Link to="/pages" className="flex flex-col items-center text-gray-600 dark:text-gray-300 hover:text-blue-500 transition-colors"  onClick={scrollToTop}>
       <GiNewspaper className='text-2xl'/>
          <span className="text-sm font-semibold">Newspaper</span>
        </Link>

        <Link to="/jobs" className="flex flex-col items-center text-gray-600 dark:text-gray-300 hover:text-blue-500 transition-colors"  onClick={scrollToTop}>
        <FaSuitcase className='text-2xl'/>
          <span className="text-sm font-semibold">Jobs</span>
        </Link>
      </div>
    </div>
  );
};

export default BottomNavigator;