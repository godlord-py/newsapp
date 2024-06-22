import React, { useState, useEffect, useContext } from "react";
import NewspaperImage from "/src/assets/newspaper.png";
import { ThemeContext } from "../context/theme";
import { FcNews } from "react-icons/fc";
import "/home/godlord/news/newsapp/src/styles/FirstPage.css";
import Separators from "./UI/seperator";
import Newspaper3D from "./UI/newspaper";

const FirstPage = () => {
  const { theme } = useContext(ThemeContext);
  const isMobile = window.innerWidth <= 600; 
  return (
    <>
      <div className="dark:bg-[#111010] w-full min-h-screen relative overflow-x-hidden">
        <div className="blurup"></div>
        <div className="text1 p-10 ml-14 mt-1 text-black font-bold dark:text-slate-200">
          #DAILY NEWS
        </div>
        <div
          className="p-3 font-bold mt-10 text-green-900 dark:text-red-600 text-6xl absolute"
          style={{ top: "28%", left: "13%", transform: "translate(-15%, -30%)" }}
        >
          <h1
            className={`HeadingText flex slide text-transparent bg-clip-text bg-cover bg-center ${
              theme === "light"
                ? "bg-gradient-to-r from-red-600 to-blue-500"
                : "bg-gradient-to-r from-red-600 to-blue-500"
            }`}
          >
            Latest
            <br />
            News Headlines <FcNews className="newssymbol mt-16 ml-4 text-black dark:text-white" />
          </h1>
          <Separators />
          <div className="flex mt-10 space-x-4">
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 italic">
              "News is the first rough draft of history." - Phil Graham
            </p>
          </div>
        </div>
        <div className="infinite-scroll-container absolute mb-20 top-0 left-0 w-full h-11/12 overflow-hidden hidden md:block">
          <div className="infinite-scroll-text text-xl font-bold text-center text-gray-800 dark:text-slate-300 whitespace-nowrap tracking-wider uppercase">
            Stay informed with the latest news updates! Stay informed with the latest news updates! Stay informed with the latest news!
          </div>
        </div>
        {/* <img
          src={NewspaperImage}
          className={`newspaper-image absolute mt-10 right-32 w-1/4 h-3/5 object-cover z-20 top-14 mr-20 rounded-lg shadow-md transition-transform hover:scale-105`}
        /> */}
        {!isMobile && <Newspaper3D/>}
        <div className="blurdown"></div>
      </div>
    </>
  );
};

export default FirstPage;