import React, { useState } from 'react';
import Card from '/home/godlord/news/newsapp/src/components/UI/cards';

const JobsLayout = () => {
  const [filter, setFilter] = useState('all'); // Initialize filter state

  return (
    <div className="bg-gray-100 dark:bg-[rgb(17,16,16)] min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold dark:text-white text-gray-800 mb-8 font-custom3">Available Jobs</h1>
        <div className="mb-4">
          <button className={`mr-4 ${filter === 'all' ? 'font-bold' : 'font-normal'}`} onClick={() => setFilter('all')}>All Jobs</button>
          <button className={`mr-4 ${filter === 'government' ? 'font-bold' : 'font-normal'}`} onClick={() => setFilter('government')}>Government Jobs</button>
          <button className={filter === 'private' ? 'font-bold' : 'font-normal'} onClick={() => setFilter('private')}>Private Jobs</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filter === 'all' && (
            <>
              <Card />
              <Card />
              <Card />
              <Card />
              <Card />
              <Card />
            </>
          )}
          {filter === 'government' && (
            <>
              <Card />
              <Card />
            </>
          )}
          {filter === 'private' && (
            <>
              <Card />
              <Card />
              <Card />
              <Card />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobsLayout;
