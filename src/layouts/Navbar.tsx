import React, { useContext, useEffect, useState } from "react";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, Switch, Link, NavbarMenuItem } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/theme";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, setTheme } = useContext(ThemeContext);
  const [enabled, setEnabled] = useState(() => {
    // Retrieve the switch state from localStorage, default to 'true' (dark mode) if not found
    const storedState = localStorage.getItem('themeSwitchState');
    return storedState ? JSON.parse(storedState) : true;
  });
  const scrollTo = () => {
    window.scrollTo({
      top: 1000,
      behavior: 'smooth'
    });
  };


  useEffect(() => {
    setEnabled(theme === 'dark');
  }, [theme]);

  const menuItems = [
    { name: "Home", path: "/", onclick: () => console.log("Home clicked") },
    { name: "News", path: `/`, onclick: scrollTo },
  ];

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setEnabled(!enabled);
    setTheme(newTheme);
  };

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen} shouldHideOnScroll isBordered>
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
          <Link href="/" aria-current="page">Home</Link>
        </NavbarItem>
        <NavbarItem>
          <Link onClick={scrollTo} aria-current="page">News</Link>
        </NavbarItem>
        <NavbarItem>
  <Link onClick={scrollTo} aria-current="page" className="relative">
    <span className="animate-pulse absolute h-2.5 w-2.5 bg-red-600 dark:bg-green-500 rounded-full top-1/2 transform -translate-y-1/3 ml-1 left-full mr-2"></span>
    Latest News
  </Link>
</NavbarItem>

      </NavbarContent>
      <NavbarContent className='flex justify-end align-end'>
        <Switch
          checked={enabled}
          onChange={toggleTheme}
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
