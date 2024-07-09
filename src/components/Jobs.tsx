import React, { useState, useEffect } from 'react';
import JobCard from '/home/godlord/news/newsapp/src/components/UI/cards';
import "/home/godlord/news/newsapp/src/styles/jobs.css";
import { Link } from 'react-router-dom'; // Import Link if you're using React Router

const JobsLayout = () => {
  const [filter, setFilter] = useState('all');
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = () => {
    fetch('http://localhost:3001/api/jobs')
      .then(response => response.json())
      .then(data => setJobs(data))
      .catch(error => console.error('Error fetching jobs:', error));
  };

  const filteredJobs = jobs.filter(job => {
    if (filter === 'all') return true;
    return job.type === filter;
  });

  return (
    <div className="bg-gray-100 dark:bg-[rgb(17,16,16)] min-h-screen py-12 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          <h1 className="text-3xl font-bold dark:text-white text-gray-800 mb-8 z-40 font-custom3 relative">
            Available Jobs
          </h1>
          <div className="blurupjobs z-30"></div>
        </div>
        <div className="mb-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          <button
            className={`w-full z-40 sm:w-auto text-center px-4 py-2 rounded-full transition ${
              filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
            }`}
            onClick={() => setFilter('all')}
          >
            All Jobs
          </button>
          <button
            className={`w-full z-40 sm:w-auto text-center px-4 py-2 rounded-full transition ${
              filter === 'government' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
            }`}
            onClick={() => setFilter('government')}
          >
            Government Jobs
          </button>
          <button
            className={`w-full z-40 sm:w-auto text-center px-4 py-2 rounded-full transition ${
              filter === 'private' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
            }`}
            onClick={() => setFilter('private')}
          >
            Private Jobs
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredJobs.length > 0 ? (
            filteredJobs.map(job => (
              <JobCard
                key={job.id}
                title={job.title}
                company={job.company}
                description={job.description}
                logoUrl={job.logoUrl}
                applyUrl={job.applyUrl}
              />
            ))
          ) : (
            <p className="text-center col-span-3">No jobs found.</p>
          )}
          <div className="blurdownjobs"></div>
        </div>
      </div>
    </div>
  );
};

export default JobsLayout;