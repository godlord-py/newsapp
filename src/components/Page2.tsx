/* eslint-disable jsx-a11y/alt-text */
import React, { useState, useEffect, useContext } from "react";
import NewspaperImage from "/src/assets/newspaper.png"; 
import { ThemeContext } from "../context/theme";

const FirstPage = () => {
  const [imagePosition, setImagePosition] = useState("top-16");
  const { theme } = useContext(ThemeContext);

  const scrollTo = () => {
    window.scrollTo({
      top: 1000,
      behavior: 'smooth'
    });
  };

  return (
    <div className="dark:bg-[#111010] w-full min-h-screen relative">
      <div className="text1 p-10 ml-16 mt-5 text-black font-bold dark:text-slate-200">#DAILY NEWS</div>
      <div className="p-3 font-bold mt-10 text-green-900 dark:text-red-600 text-6xl absolute" style={{ top: "25%", left: "12%", transform: "translate(-15%, -30%)" }}>
      <h1 className={`slide text-transparent ${theme === 'dark' ? 'dark:bg-gradient-to-r dark:from-yellow-500 dark:to-red-600' : 'bg-gradient-to-r from-red-600 to-blue-500'} bg-clip-text`}>
            Latest<br />
            News Headlines
            </h1>
        <p className="p-3 text-xl mt-4 text-gray-800 dark:text-slate-300">
          Stay updated with the latest news and happenings around the world.<br/>Get access to breaking news, in-depth analysis, and exclusive stories.
        </p>
        <button onClick={scrollTo}  className="p-4 text-white bg-green-600 text-xl px-6 py-3 rounded-full hover:bg-blue-600 dark:bg-[#111010] dark:border-4 dark:hover:bg-blue-600 transition-transform hover:scale-1">
          Read Now
        </button>
      </div>
      <img
        src={NewspaperImage}
        className={`newspaper-image absolute right-32 w-1/4 h-3/5 object-cover top-14 mr-20 rounded-lg shadow-md transition-transform hover:scale-105`}
      />
    </div>
  );
};

export default FirstPage;
