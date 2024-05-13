import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Pages from '../components/NewsPage';
import FirstPage from '../components/FirstPage';
import NotFound from '../components/NotFound';
import JobsLayout from '../components/Jobs';
const router = createBrowserRouter([

  {
    path: '/',
    element: (
      <>
        <FirstPage />
      </>
    ),
  },
  {
    path: '/pages',
    element: <Pages/>,
  },
  {
    path: '/jobs',
    element: <JobsLayout />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default router;