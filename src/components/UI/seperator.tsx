import React from 'react';
import * as Separator from '@radix-ui/react-separator';

const Separators = () => (
  <div className="w-full p-2 text-lg sm:text-xl mt-4 max-w-[300px]">
    <div className="text-black dark:text-white text-[15px] leading-5">Stay updated with the latest news and happenings around the world.</div>
    <div className="text-black dark:text-white text-[15px] leading-5">Get access to breaking news, in-depth analysis, and exclusive stories.</div>
    <Separator.Root className="bg-violet6 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px my-[15px]" />
    <div className="flex h-5 items-center">
      <div className="text-black dark:text-gray-300 text-[15px] leading-5">Newspapers</div>
      <Separator.Root
        className="bg-violet6 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px mx-[15px]"
        decorative
        orientation="vertical"
      />
      <div className="text-black dark:text-gray-300 text-[15px] leading-5">Magazines</div>
      <Separator.Root
        className="bg-violet6 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px mx-[15px]"
        decorative
        orientation="vertical"
      />
      <div className="text-black dark:text-gray-300 text-[15px] leading-5">Jobs</div>
    </div>
  </div>
);

export default Separators;