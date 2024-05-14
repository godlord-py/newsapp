import React from "react";
import { Divider } from "@nextui-org/react";

const Separators = () => {
  return (
    <div className="max-w-md">
      <div className="space-y-1 py-4">
        <h4 className="text-xl text-black dark:text-white font-medium font-custom">Stay updated with the latest news</h4>
        <p className="text-base text-gray-600 dark:text-gray-400">Get access to breaking news, in-depth analysis, and exclusive stories.</p>
      </div>
      <Divider className="my-4 bg-gray-900 dark:bg-gray-200" />
      <div className="flex h-5 items-center space-x-4 text-sm sm:text-lg">
        <div className="dark:text-gray-200 text-black font-custom2">Newspapers</div>
        <Divider orientation="vertical" className="bg-gray-900 dark:bg-gray-200" />
        <div className="dark:text-gray-200 text-black font-custom2">Magazines</div>
        <Divider orientation="vertical" className="bg-gray-900 dark:bg-gray-200" />
        <div className="dark:text-gray-200 text-black font-custom2">Jobs</div>
      </div>
    </div>
  );
}


export default Separators;