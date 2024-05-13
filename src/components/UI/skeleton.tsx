import React from 'react';
import { motion } from 'framer-motion';

const NewspaperSkeleton = () => {
  return (
    <div className="newspaper-skeleton">
      {[...Array(1)].map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="flex-shrink-0 animate-pulse  bg-gray-300 p-4 rounded-md mr-4 mb-4"
          style={{ minWidth: '360px', minHeight: '150px' }}
        >
          <div className="w-[700px] h-[700px] bg-gray-200 rounded-lg">
          <div className="font-bold rounded-xl bg-white h-16 w-[700px]"></div>'
            <div className='font-bold rounded-full m-2 bg-[#c2d4ff] h-8 w-[400px] '></div>
            <div className='font-bold rounded-full m-2 bg-white h-8 w-[200px] '></div>
            <div className='font-bold rounded-full m-2 bg-[#c2d4ff] h-8 w-[600px] '></div>
            <div className='font-bold rounded-full m-2 bg-white h-8 w-[400px] '></div>
            <div className='font-bold rounded-full m-2 bg-[#c2d4ff] h-8 w-[400px] '></div>
            <div className='font-bold rounded-full m-2 bg-white h-8 w-[200px] '></div>
            <div className='font-bold rounded-full m-2 bg-[#c2d4ff] h-8 w-[600px] '></div>
            <div className='font-bold rounded-full m-2 bg-white h-8 w-[400px] '></div>
            <div className='font-bold rounded-full m-2 bg-[#c2d4ff] h-8 w-[400px] '></div>
            <div className='font-bold rounded-full m-2 bg-white h-8 w-[200px] '></div>
            <div className='font-bold rounded-full m-2 bg-[#c2d4ff] h-8 w-[600px] '></div>
            <div className='font-bold rounded-full m-2 bg-white h-8 w-[400px] '></div>
            <div className='font-bold rounded-full m-2 bg-[#c2d4ff] h-8 w-[400px] '></div>
            <div className='font-bold rounded-full m-2 bg-white h-8 w-[200px] '></div>
            <div className='font-bold rounded-full m-2 bg-[#c2d4ff] h-8 w-[600px] '></div>
          </div>
          <div className="flex-1"></div>
        </motion.div>
      ))}
    </div>
  );
};

export default NewspaperSkeleton;
