/* eslint-disable jsx-a11y/alt-text */
import React, { useState, useEffect, useContext } from "react";
import NewspaperImage from "/src/assets/newspaper.png"; 
import { ThemeContext } from "../context/theme";
import { FcNews } from "react-icons/fc";
import NavBar from "../layouts/Navbar";
import "/home/godlord/news/newsapp/src/styles/FirstPage.css";
import { AiOutlineArrowDown } from "react-icons/ai";
import Separators from "./UI/seperator";
import { Link } from "@nextui-org/react";



const FirstPage = () => {
  const [imagePosition, setImagePosition] = useState("top-16");
  const { theme } = useContext(ThemeContext);
  const isMobile = window.innerWidth <= 600; 
 
  const Handlepage = () => {
    <Link href="/pages">
    </Link>
  };
  return (
    <>
    <div className="dark:bg-[#111010] w-full min-h-screen relative">
      <div className="blurup"></div>
      
      <div className="text1 p-10 ml-14 mt-1 text-black font-bold dark:text-slate-200">#DAILY NEWS</div>
      <div className="p-3 font-bold mt-10 text-green-900 dark:text-red-600 text-6xl absolute" style={{ top: "28%", left: "12%", transform: "translate(-15%, -30%)" }}>
        <h1 className={`HeadingText flex slide text-transparent bg-clip-text bg-cover bg-center ${theme === 'light' ? 'bg-gradient-to-r from-red-600 to-blue-500': 'bg-gradient-to-r from-red-600 to-blue-500'}`}>
          Latest<br />
          News Headlines <FcNews className="newssymbol mt-16 ml-4 text-black dark:text-white" />
        </h1>
          <Separators />
          <Link href="/pages">
        <button onClick={Handlepage} className="flex mt-10 p-2 text-white bg-green-600 text-xl px-6 py-3 rounded-full hover:bg-blue-600 dark:bg-[#111010] dark:border-4 dark:hover:bg-blue-600 transition-transform hover:scale-1">
          Read Now 
        </button>
        </Link>
    
      </div>
      
      <div className="infinite-scroll-container absolute mb-20 top-0 left-0 w-full h-11/12 overflow-hidden hidden md:block">
        <div className="infinite-scroll-text text-xl font-bold text-center text-gray-800 dark:text-slate-300 whitespace-nowrap">
          Stay informed with the latest news updates! Stay informed with the latest news updates! Stay informed with the latest news updates!
        </div>
      </div>
      
      <img
        src={NewspaperImage}
        className={`newspaper-image absolute mt-10 right-32 w-1/4 h-3/5 object-cover z-20 top-14 mr-20 rounded-lg shadow-md transition-transform hover:scale-105`} />
   <div className="blurdown"></div>
    </div></>
  );
};

export default FirstPage;
