import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import NewsFeed from '../components/LatestNews';
import Pages from '../components/NewsPage';
import FirstPage from '../components/FirstPage';
import PDFViewer from '../components/PDFviewer';
import NotFound from '../components/NotFound';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <>
        <FirstPage />
        <Pages />
      </>
    ),
  },
  {
    path: '/:publicationName',
    element: <PDFViewer />,
  },
  {
    path: 'latestnews',
    element: <NewsFeed />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default router;