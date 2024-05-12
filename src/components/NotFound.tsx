import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 dark:bg-[#111010]">
      <h1 className="text-4xl font-bold text-center mb-8">Oops! Page Not Found</h1>
      <img
        src="https://media.giphy.com/media/9J7tdYltWyXIY/giphy.gif"
        alt="Confused Travolta GIF"
        className="w-80 h-80 rounded-full mb-8"
      />
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
        Looks like you've wandered into the unknown. Don't worry, even the best explorers get lost sometimes!
      </p>
      <Link to="/" className="text-blue-600 text-xl dark:text-blue-400 hover:underline">
        Go back home
      </Link>
    </div>
  );
};

export default NotFound;
