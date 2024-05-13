import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button, CircularProgress, Pagination } from '@nextui-org/react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import '/home/godlord/news/newsapp/src/styles/Pages.css'; 
import NewspaperSkeleton from './skeleton';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation } from 'react-router-dom';


const PDFview = ({ pdfFiles, onLoadSuccess }) => {
  const maxScale = 1.4;
  const maxMScale = 1;
  const minScale = 0.6;
  const minMScale = 0.4;
  const MobileZoom = 0.4;
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(minScale);
  const [mobilescale , setMobileScale] = useState(MobileZoom);
  const [loading, setLoading] = useState(true); // State variable for loading indicator
  const pagesRef = useRef({});
  const scrollPositions = useRef({});
  const [hideButtons, setHideButtons] = useState(false);
  const isMobile = window.innerWidth <= 600; 

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
    setLoading(false);
  };

  const handlePageChange = (page) => {
    saveScrollPosition(pageNumber);
    setPageNumber(page);
    scrollToPage(page);
  
    // Check if the next page is not loaded and load it manually
    if (!pagesRef.current[page + 1]) {
      setPageNumber(page + 1);
    }
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
    setTimeout(() => setLoading(false), 500);
  };
  
  const handleZoomOut = () => {
    setLoading(true); // Set loading to true while zooming
    setScale((prevScale) => Math.max(minScale, prevScale - 0.2));
    setTimeout(() => setLoading(false), 500); 
  };

  const handleMZoomIn = () => {
    setLoading(true); // Set loading to true while zooming
    setMobileScale((prevScale) => Math.min(prevScale + 0.2, maxMScale));
    setTimeout(() => setLoading(false), 500);
  };
  
  const handleMZoomOut = () => {
    setLoading(true); // Set loading to true while zooming
    setMobileScale((prevScale) => Math.max(minMScale, prevScale - 0.2));
    setTimeout(() => setLoading(false), 500); 
  };

  const handleShareClick = () => {
    const location = useLocation();
    const currentPath = location.pathname;
    const pdfFilePath = encodeURIComponent(pdfFiles.path);
    const shareUrl = `${window.location.origin}${currentPath}?pdf=${pdfFilePath}`;
  
    window.open(`http://localhost:5173/share?url=${encodeURIComponent(shareUrl)}`, '_blank');
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
    <div className='mobilepdf ml-0 sm:ml-[-64px] w-full max-w-screen'>
    {loading && (
        <div className="flex flex-col justify-center items-center h-screen">
          {isMobile && <CircularProgress className='justify-center text-center' />}
          <div className='mt-20 ml-48'>
          {!isMobile && <NewspaperSkeleton/>}
          </div>
          <p className="mt-4 text-xl font-semibold text-gray-600">Paper is loading...</p>
        </div>
      )}
      {/* MOBILE UI */}
        {isMobile && (
           <>
               <div className="mobilezoom-buttons" style={{ zIndex: 1001 }}>
              <button className='nextbutton m-2' onClick={handleMZoomIn}>Zoom In</button>
              <button className='nextbutton p-4' onClick={handleMZoomOut}>Zoom Out</button>
            </div>

        <Document
          file={decodeURIComponent(pdfFiles)}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onLoadError}
          options={options}
          className={"sm:mr-28 mt-20"}
        >
            {Array.from(new Array(numPages), (el, index) => (
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                scale={mobilescale}
                onLoadSuccess={() => handlePageVisible(index + 1)}
                inputRef={(ref) => { pagesRef.current[index + 1] = ref; } } />
            ))}
          </Document>
        </>
      )}



      {/* PC UI */}
      {!isMobile && (
        <>
          <Pagination
            isCompact={true}
            className='pagination text-base'
            total={numPages || 1}
            initialPage={pageNumber}
            onChange={handlePageChange}
          />     
    
                  <Document
                file={decodeURIComponent(pdfFiles)}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onLoadError}
                options={options}
                className={"sm:mr-28 mt-20"}
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
    
          <div className={`zoom-buttons ${hideButtons ? 'hide' : ''}`}>
            <Button aria-label="Zoom In" className='nextbutton m-2' onClick={handleZoomIn}>Zoom In</Button>
            <Button aria-label="Zoom Out" className='nextbutton' onClick={handleZoomOut}>Zoom Out</Button>
          </div>
        </>
      )}
    </div>
  );
};

export default PDFview;
