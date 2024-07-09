import React, { useContext, useEffect, useState } from "react";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, Link, NavbarMenuItem } from "@nextui-org/react";
import { ThemeContext } from "../context/theme";
import ThemeToggle from "../components/Themebutton";
import { redirect } from "react-router-dom";
import TabButton from "../components/UI/Tabs";
import { useLocation } from 'react-router-dom'

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, setTheme } = useContext(ThemeContext);

  const [enabled, setEnabled] = useState(() => {
    // Retrieve the switch state from localStorage, default to 'true' (dark mode) if not found
    const storedState = localStorage.getItem('themeSwitchState');
    return storedState ? JSON.parse(storedState) : true;
  });

  useEffect(() => {
    setEnabled(theme === 'dark');
  }, [theme]);

  const menuItems = [
    { name: "Home", path: "/", onclick: () => redirect("/") },
    { name: "More content to be added", path: `/`, },
  ];

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setEnabled(!enabled);
    setTheme(newTheme);
  };

  return (
    <Navbar className="z-50" onMenuOpenChange={setIsMenuOpen} shouldHideOnScroll isBordered>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <a className="font-bold text-inherit">News App</a>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="start">
        <NavbarItem>
            <TabButton/>
        </NavbarItem>
      </NavbarContent>
      
    
      
      
      <NavbarContent className='flex justify-end align-end'>
        <ThemeToggle
          onClick={toggleTheme} 
        />
      </NavbarContent>
      
      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item.name}-${index}`}>
            <Link
              color={
                index === 2 ? "primary" : index === menuItems.length - 1 ? "danger" : "foreground"
              }
              className="w-full"  
              href="#"
              size="lg"
              onClick={item.onclick}
            >
              {item.name} 
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}

export default NavBar;

