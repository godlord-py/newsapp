import React from 'react';
import { BrowserRouter as Router, Routes, Route, createBrowserRouter } from 'react-router-dom';
import NewsFeed from '../components/LatestNews';
import Pages from '../components/Page';
import FirstPage from '../components/Page2';
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