import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
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
    path: '*',
    element: <NotFound />,
  },
]);

export default router;