import React, { useContext, useState } from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/solid';
import { ThemeContext } from '../context/theme';

interface ToggleSwitchProps {
    checked: boolean;
    onChange: () => void;
}

const ThemeToggle = ({ onClick}) => {
    const { theme, setTheme } = useContext(ThemeContext); 

const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    };


  return (
    <button
      className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800"
      onClick={toggleTheme} // Toggle theme on click
    >
      {theme === 'dark' ? (
        <MoonIcon className="w-6 h-6 text-gray-800 dark:text-yellow-500" />
      ) : (
        <SunIcon className="w-6 h-6 text-yellow-500 dark:text-gray-300" />
      )}
    </button>
  );
};

export default ThemeToggle;
