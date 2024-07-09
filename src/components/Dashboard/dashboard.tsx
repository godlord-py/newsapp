import React from 'react';

const Dashboard = () => {
  return (
    <div className="space-y-4">
      <div className="bg-blue-100 dark:bg-blue-800 p-4 rounded-lg">
        <h3 className="font-semibold text-blue-800 dark:text-blue-100">Total Publications</h3>
        <p className="text-2xl font-bold text-blue-600 dark:text-blue-300">120</p>
      </div>
      
      <div className="bg-green-100 dark:bg-green-800 p-4 rounded-lg">
        <h3 className="font-semibold text-green-800 dark:text-green-100">Active Users</h3>
        <p className="text-2xl font-bold text-green-600 dark:text-green-300">1,234</p>
      </div>
      
      <div className="bg-yellow-100 dark:bg-yellow-800 p-4 rounded-lg">
        <h3 className="font-semibold text-yellow-800 dark:text-yellow-100">New Articles Today</h3>
        <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-300">15</p>
      </div>
      
      <div className="bg-purple-100 dark:bg-purple-800 p-4 rounded-lg">
        <h3 className="font-semibold text-purple-800 dark:text-purple-100">Total Page Views</h3>
        <p className="text-2xl font-bold text-purple-600 dark:text-purple-300">50,000</p>
      </div>
    </div>
  );
};

export default Dashboard;