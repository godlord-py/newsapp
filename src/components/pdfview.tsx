// Import necessary libraries
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Pagination, Button } from '@nextui-org/react';
import { CircularProgress } from '@nextui-org/react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import '/home/godlord/news/newsapp/src/styles/Pages.css'; 

const PDFview = ({ pdfFiles, onLoadSuccess }) => {
  const maxScale = 1.4;
  const minScale = 0.2;
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(minScale);
  const [loading, setLoading] = useState(true); // State variable for loading indicator
  const containerRef = useRef(null);
  const pagesRef = useRef({});
  const scrollPositions = useRef({});
  const [hideButtons, setHideButtons] = useState(false);

  // Lazy loading and caching
  const [loadedPages, setLoadedPages] = useState({});

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

    return () => {
      pdfjs.GlobalWorkerOptions.workerSrc = null;
    };
  }, []);

  useEffect(() => {
    setPageNumber(1);
  }, [pdfFiles]);

  useEffect(() => {
    if (window.innerWidth <= 500) {
      setScale(minScale);
    } else {
      setScale(0.75);
    }
  }, []);

  useEffect(() => {
    setLoading(true); // Set loading to true when PDF files change
  }, [pdfFiles]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    if (onLoadSuccess) {
      onLoadSuccess(numPages);
    }
    setLoading(false); // Set loading to false when PDF is loaded
  };

  const onLoadError = (error) => {
    console.error('Error loading PDF:', error);
    setLoading(false); // Set loading to false in case of error
  };

  const handlePageChange = (page) => {
    saveScrollPosition(pageNumber);
    setPageNumber(page);
    scrollToPage(page);
  };

  const scrollToPage = (page) => {
    const pageElement = pagesRef.current[page];
    if (pageElement) {
      const scrollPosition = scrollPositions.current[page];
      if (scrollPosition !== undefined) {
        pageElement.scrollTop = scrollPosition;
      } else {
        pageElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  };

  const saveScrollPosition = (page) => {
    const pageElement = pagesRef.current[page];
    if (pageElement) {
      scrollPositions.current[page] = pageElement.scrollTop;
    }
  };

  const handleZoomIn = () => {
    setLoading(true); // Set loading to true while zooming
    setScale((prevScale) => Math.min(prevScale + 0.2, maxScale));
    setTimeout(() => setLoading(false), 1200);
  };
  
  const handleZoomOut = () => {
    setLoading(true); // Set loading to true while zooming
    setScale((prevScale) => Math.max(minScale, prevScale - 0.2));
    setTimeout(() => setLoading(false), 1200); 
  };

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const isScrollingDown = scrollTop > scrollPositions.current;
    setHideButtons(isScrollingDown);
    scrollPositions.current = scrollTop;
  };

  const options = useMemo(() => ({
    cMapUrl: '/cmaps/',
  }), []);

  const handlePageVisible = (pageNumber) => {
    if (pageNumber === numPages) return;
    // Load the next page if not already loaded
    if (!pagesRef.current[pageNumber + 1]) {
      setPageNumber(pageNumber + 1);
    }
  };

  const handleScrollToTop = () => {
    const publicationContainer = document.querySelector('.mobilepdf'); // Select the container element
  
    if (publicationContainer) {
      if (!pdfFiles) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        publicationContainer.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to the top of the container
      }
    }
  };
  
  return (
    <div className='mobilepdf ml-20 w-full max-w-screen'>
     {loading && (
        <div className="flex flex-col ml-60 justify-center items-center h-screen">
          <CircularProgress className='justify-center text-center' />
          <p className="mt-4 text-xl font-semibold text-gray-600">Paper is loading...</p>
        </div>
      )}

      {pdfFiles && (
        <>
          <div className={`zoom-buttons ${hideButtons ? 'hide' : ''}`}>
            <Button className='nextbutton m-2' onClick={handleZoomIn}>Zoom In</Button>
            <Button className='nextbutton' onClick={handleZoomOut}>Zoom Out</Button>
          </div>
          <Pagination
            className='pagination'
            total={numPages || 1}
            initialPage={pageNumber}
            onChange={handlePageChange}
          />
          <div ref={containerRef} onScroll={handleScroll}>
            <Document
              file={pdfFiles}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onLoadError}
              options={options}
            >
              {Array.from(new Array(numPages), (el, index) => (
                <Page
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                  scale={scale}
                  onLoadSuccess={() => handlePageVisible(index + 1)}
                  inputRef={(ref) => { pagesRef.current[index + 1] = ref; }}
                />
              ))}
            </Document>
          </div>
          <Button className='mobilepdf nextbutton' onClick={handleScrollToTop}>Back to Top</Button>
        </>
      )}
    </div>
  );
};

export default PDFview;
