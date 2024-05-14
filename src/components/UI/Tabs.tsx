import React, { useState, useEffect } from "react";
import { Tabs, Tab, Tooltip } from "@nextui-org/react";
import { GiNewspaper } from "react-icons/gi";
import { FaSuitcase } from "react-icons/fa";
import { GoHome } from "react-icons/go";
import { Link } from "react-router-dom";

const TabButton = () => {
  // Get the initial tab state from local storage or default to "home"
  const [selectedTab, setSelectedTab] = useState(() => {
    const storedTab = localStorage.getItem("selectedTab");
    return storedTab ? storedTab : "home";
  });

  // Update local storage whenever the selected tab changes
  useEffect(() => {
    localStorage.setItem("selectedTab", selectedTab);
  }, [selectedTab]);

  const handleTabChange = (key) => {
    setSelectedTab(key);
  };

  return (
    <div className="flex w-full flex-col">
      <Tabs
        aria-label="Options"
        color="primary"
        variant="bordered"
        defaultSelectedKey={selectedTab}
        onSelectionChange={handleTabChange}
      >
        <Tab
          key="home"
          title={
            <div className="flex items-center space-x-2">
              <Link to="/">
                <GoHome />
              </Link>
              <Link to="/" className="text-black dark:text-white">Home</Link>
            </div>
          }
        />
        <Tab
          key="newspapers"
          title={
            <div className="flex items-center space-x-2">
              <Link to="/pages" className="text-black dark:text-white">
                <GiNewspaper />
              </Link>
              <Tooltip
                closeDelay={200}
                delay={300}
                offset={7}
                className="dark:bg-black dark:text-white bg-gray-300"
                content="Explore Latest Newspapers & Magazines"
              >
                <Link to="/pages" className="text-black dark:text-white">
                  Newspapers
                </Link>
              </Tooltip>
            </div>
          }
        />
        <Tab
          key="jobs"
          title={
            <div className="flex items-center space-x-2">
              <Link to="/jobs" className="text-black dark:text-white">
                <FaSuitcase />
              </Link>
              <Tooltip
                offset={7}
                closeDelay={200}
                delay={300}
                className="dark:bg-black dark:text-white bg-gray-300"
                content="Explore Jobs"
              >
                <Link to="/jobs" className="text-black dark:text-white">
                  Jobs
                </Link>
              </Tooltip>
            </div>
          }
        />
      </Tabs>
    </div>
  );
};

export default TabButton;
