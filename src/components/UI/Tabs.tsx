import React from "react";
import {Tabs, Tab, Tooltip, Link} from "@nextui-org/react";
import { GiNewspaper } from "react-icons/gi";
import { FaSuitcase } from "react-icons/fa";
import { GoHome } from "react-icons/go";

const TabButton = () => {
    const handleRoute = () => {
        <Link href="/pages">
            </Link>
      };
  return (
    <div className="flex w-full flex-col">
      <Tabs aria-label="Options" color="primary" variant="bordered">
      <Tab
          key="home"
          title={
            <div className="flex items-center space-x-2">
              <GoHome href="/" />
              <a href="/">Home</a>
            </div>
          }
        />
        <Tab
          key="newspapers"
          title={
            <div className="flex items-center space-x-2">
              <GiNewspaper href="/pages" />
              <Tooltip closeDelay={200} delay={300} offset={7} className="dark:bg-black dark:text-white bg-gray-300" content="Explore Latest Newspapers & Magazines">
              <a href="/pages" className="text-black dark:text-white">Newspapers</a>
              </Tooltip>
            </div>
          }
        />
        <Tab
          key="jobs"
          title={
            <div className="flex items-center space-x-2">
             <FaSuitcase href="/jobs" />
             <Tooltip offset={7} closeDelay={200} delay={300} className="dark:bg-black dark:text-white bg-gray-300" content="Explore Jobs">
              <a href="/jobs" className="text-black dark:text-white">Jobs</a>
              </Tooltip>
            </div>
          }
        />
      </Tabs>
    </div>  
  );
}

export default TabButton;