import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AddJobPage = () => {
  const navigate = useNavigate();
  const [jobData, setJobData] = useState({
    title: '',
    company: '',
    description: '',
    logoUrl: '',
    applyUrl: '',
    type: 'private',
  });
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('https://newsappcode1971694234svsvasvasvsavwefwff.onrender.com/api/jobs');
      if (response.ok) {
        const data = await response.json();
        setJobs(data);
      } else {
        throw new Error('Failed to fetch jobs');
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError('Failed to fetch jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://newsappcode1971694234svsvasvasvsavwefwff.onrender.com/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData),
      });
      if (response.ok) {
        alert('Job added successfully!');
        fetchJobs(); // Refresh the job list
        setJobData({
          title: '',
          company: '',
          description: '',
          logoUrl: '',
          applyUrl: '',
          type: 'private',
        });
      } else {
        throw new Error('Failed to add job');
      }
    } catch (error) {
      console.error('Error adding job:', error);
      alert('Failed to add job. Please try again.');
    }
  };

  const handleDelete = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        const response = await fetch(`https://newsappcode1971694234svsvasvasvsavwefwff.onrender.com/api/jobs/${jobId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          alert('Job deleted successfully!');
          fetchJobs(); // Refresh the job list
        } else {
          throw new Error('Failed to delete job');
        }
      } catch (error) {
        console.error('Error deleting job:', error);
        alert('Failed to delete job. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#111010] py-10 flex flex-col items-center">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-black dark:text-white">Job Portal Admin</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left side - Add Job Form */}
          <div className="bg-white dark:bg-[#1f1f1f] shadow-lg rounded-lg p-6">
            <h2 className="text-3xl text-black dark:text-white font-semibold mb-5">Add New Job</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Job Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={jobData.title}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 dark:bg-gray-800 dark:text-gray-200"
                />
              </div>
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Company</label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={jobData.company}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 dark:bg-gray-800 dark:text-gray-200"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={jobData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 dark:bg-gray-800 dark:text-gray-200"
                ></textarea>
              </div>
              <div>
                <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Logo URL</label>
                <input
                  type="url"
                  id="logoUrl"
                  name="logoUrl"
                  value={jobData.logoUrl}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 dark:bg-gray-800 dark:text-gray-200"
                />
              </div>
              <div>
                <label htmlFor="applyUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Apply URL</label>
                <input
                  type="url"
                  id="applyUrl"
                  name="applyUrl"
                  value={jobData.applyUrl}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 dark:bg-gray-800 dark:text-gray-200"
                />
              </div>
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Job Type</label>
                <select
                  id="type"
                  name="type"
                  value={jobData.type}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 dark:bg-gray-800 dark:text-gray-200"
                >
                  <option value="private">Private</option>
                  <option value="government">Government</option>
                </select>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 dark:bg-blue-700 text-white rounded-md hover:bg-blue-600 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Add Job
                </button>
              </div>
            </form>
          </div>

          {/* Right side - Current Jobs */}
          <div className="bg-white dark:bg-[#1f1f1f] shadow-lg rounded-lg p-6 overflow-y-auto max-h-[calc(100vh-5rem)]">
            <h2 className="text-3xl text-black dark:text-white font-semibold mb-5">Current Jobs</h2>
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zM2 12a10 10 0 0010 10v-4a6 6 0 01-6-6H2z"
                  ></path>
                </svg>
              </div>
            ) : error ? (
              <p className="text-red-500 text-center">{error}</p>
            ) : jobs.length > 0 ? (
              <ul className="space-y-4">
                {jobs.map((job) => (
                  <li key={job.id} className="border-b pb-4 border-gray-300 dark:border-gray-700">
                    <div className="flex items-start space-x-4">
                      {job.logoUrl && <img src={job.logoUrl} alt="logo" className="w-12 h-12 rounded-full" />}
                      <div>
                        <h3 className="text-xl text-black dark:text-white font-bold">{job.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{job.company}</p>
                        <p className="mt-2 text-gray-700 dark:text-gray-300">{job.description}</p>
                        <div className="flex mt-4 space-x-2">
                          <button
                            onClick={() => handleDelete(job.id)}
                            className="px-3 py-1 bg-red-500 dark:bg-red-700 text-white rounded-md hover:bg-red-600 dark:hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                          >
                            Delete
                          </button>
                          <a
                            href={job.applyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 bg-green-500 dark:bg-green-700 text-white rounded-md hover:bg-green-600 dark:hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                          >
                            Apply
                          </a>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400">No jobs available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddJobPage;
