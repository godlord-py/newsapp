import React, { useContext } from "react";
import { ThemeContext } from "../context/theme";
import { FcNews } from "react-icons/fc";
import "/home/godlord/news/newsapp/src/styles/FirstPage.css";
import Newspaper3D from "./UI/newspaper";

const FirstPage = () => {
  const { theme } = useContext(ThemeContext);
  const isMobile = window.innerWidth <= 600;

  return (
    <>
      <div className="dark:bg-[#111010] bg-gray-100 w-full min-h-screen relative overflow-x-hidden">
        <div className="blurup z-20"></div>
        <p className="text1 p-10 ml-14 mt-1 z-[100] text-slate-900 font-bold dark:text-slate-100">
          #DAILY NEWS
        </p>
        <div
          className="p-3 font-bold mt-10 text-green-900 dark:text-red-600 text-6xl absolute"
          style={{ top: "28%", left: "13%", transform: "translate(-15%, -30%)" }}
        >
          <h1
            className={`HeadingText font-custom3 flex slide text-transparent bg-clip-text bg-cover bg-center ${
              theme === "light"
                ? "bg-gradient-to-r from-red-600 to-blue-500"
                : "bg-gradient-to-r from-red-600 to-blue-500"
            }`}
          >
            Latest
            <br />
            News Headlines <FcNews className="newssymbol mt-16 ml-4 text-black dark:text-white" />
          </h1>
          
          {/* Added text */}
          <div className="mt-8 mb-6 space-y-2">
            <p className="text-2xl font-custom2 text-gray-800 dark:text-gray-200">
              Stay updated with the latest news
            </p>
            <p className="text-lg font-custom2 text-gray-700 dark:text-gray-300">
              Get access to breaking news, in-depth analysis, and exclusive stories.
            </p>
          </div>

          {/* Decorative element */}
          <div className="my-8 flex items-center">
            <div className="flex-grow h-0.5 bg-gradient-to-r from-red-600 to-blue-500"></div>
            <div className="mx-4 text-3xl text-gray-800 dark:text-gray-200">⭐</div>
            <div className="flex-grow h-0.5 bg-gradient-to-r from-blue-500 to-red-600"></div>
          </div>

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
        {!isMobile && <Newspaper3D/>}
        <div className="blurdown"></div>
      </div>
    </>
  );
};

export default FirstPage;