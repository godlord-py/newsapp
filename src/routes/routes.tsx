import React from 'react';
import { BrowserRouter as Router, Routes, Route, createBrowserRouter } from 'react-router-dom';
import NewsFeed from '../components/LatestNews';
import Pages from '../components/NewsPage';
import FirstPage from '../components/FirstPage';
const router = createBrowserRouter([
  {
      path: '/',
      element:(   
          <>
          <FirstPage />
          <Pages />
          </>
      ),
},
{
  path: 'latestnews',
  element: (
    <NewsFeed/>
  )
}
]);

export default router;