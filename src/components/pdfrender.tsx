import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button, CircularProgress, Pagination } from '@nextui-org/react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import '/home/godlord/news/newsapp/src/styles/Pages.css'; 
import NewspaperSkeleton from './UI/skeleton';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation } from 'react-router-dom';
import PageThumbnailNavigator from './UI/PageThumbnailNavigator';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

const PDFview = ({ pdfFiles, onLoadSuccess }) => {
  const maxScale = 1.4;
  const maxMScale = 1;
  const minScale = 0.7;
  const minMScale = 0.4;
  const MobileZoom = 0.276;
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(minScale);
  const [mobilescale , setMobileScale] = useState(MobileZoom);
  const [loading, setLoading] = useState(true); 
  const pagesRef = useRef({});
  const scrollPositions = useRef({});
  const [hideButtons, setHideButtons] = useState(false);
  const isMobile = window.innerWidth <= 600; 

  // Lazy loading and caching
  const [loadedPages, setLoadedPages] = useState({});
  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
  }, []);
  useEffect(() => {
    setPageNumber(1);
    setLoadedPages({ 1: true }); // Load the first page by default
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
    const nextPage = Math.min(Math.max(page, 1), numPages); 
    saveScrollPosition(pageNumber);
    setPageNumber(nextPage);
    scrollToPage(nextPage);
    // Load the next page if not already loaded
    if (!loadedPages[page + 1]) {
      setLoadedPages((prevLoadedPages) => ({
        ...prevLoadedPages,
        [page + 1]: true,
      }));
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
    setTimeout(() => setLoading(false));
  };
  
  const handleZoomOut = () => {
    setLoading(true); // Set loading to true while zooming
    setScale((prevScale) => Math.max(minScale, prevScale - 0.2));
    setTimeout(() => setLoading(false)); 
  };

  const handleMZoomIn = () => {
    setLoading(true); // Set loading to true while zooming
    setMobileScale((prevScale) => Math.min(prevScale + 0.2, maxMScale));
    setTimeout(() => setLoading(false), 600);
  };
  
  const handleMZoomOut = () => {
    setLoading(true); // Set loading to true while zooming
    setMobileScale((prevScale) => Math.max(minMScale, prevScale - 0.2));
    setTimeout(() => setLoading(false), 600); 
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
  
    // Load the next two pages if not already loaded
    if (!loadedPages[pageNumber + 1]) {
      setLoadedPages((prevLoadedPages) => ({
        ...prevLoadedPages,
        [pageNumber + 1]: true,
      }));
    }
  
    if (!loadedPages[pageNumber + 2]) {
      setLoadedPages((prevLoadedPages) => ({
        ...prevLoadedPages,
        [pageNumber + 2]: true,
      }));
    }
  };
  const handleKeyDown = (event) => {
    if (event.key === 'ArrowLeft') {
      // Go to the previous page
      handlePageChange(pageNumber === 1 ? numPages : pageNumber - 1);
    } else if (event.key === 'ArrowRight') {
      // Go to the next page
      handlePageChange(pageNumber === numPages ? 1 : pageNumber + 1);
    }
  };

  useEffect(() => {
    const handleKeyDownEvent = (event) => {
      handleKeyDown(event);
    };
  
    window.addEventListener('keydown', handleKeyDownEvent);
  
    return () => {
      window.removeEventListener('keydown', handleKeyDownEvent);
    };
  }, [handleKeyDown]);

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
          {isMobile && <CircularProgress className='justify-center fixed z-50 text-center' />}
          <div className='mt-10 ml-48 fixed z-50'>
          {!isMobile && <NewspaperSkeleton/>}
          </div>
        </div>
      )}
      {/* MOBILE UI */}
        {isMobile && (
           <>
           <PageThumbnailNavigator
            pdfFile={decodeURIComponent(pdfFiles)}
            numPages={numPages}
            currentPage={pageNumber}
            onPageChange={handlePageChange}
          />
           <TransformWrapper>
             <TransformComponent>
        <Document
          file={decodeURIComponent(pdfFiles)}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onLoadError}
          options={options}
          className={"sm:mr-28 mt-10"}
        >
               <Page
              key={`page_${pageNumber}`}
              pageNumber={pageNumber}
              scale={MobileZoom}
              onLoadSuccess={() => handlePageVisible(pageNumber)}
              inputRef={(ref) => {
                pagesRef.current[pageNumber] = ref;
              }}
            />
          </Document>
          </TransformComponent>
          </TransformWrapper>    
        </>
      )}



      {/* PC UI */}
      {!isMobile && (
        <>
          <div className="fixed top-60 left-0 w-full sm:z-10 z-10 p-4 flex justify-between items-center">
            <FaArrowLeft className="cursor-pointer w-[40px] h-[40px] bg-gray-400 rounded-full text-2xl" onClick={() => handlePageChange(pageNumber - 1)} />
            <FaArrowRight className="cursor-pointer w-[40px] h-[40px] bg-gray-400 rounded-full text-2xl" onClick={() => handlePageChange(pageNumber + 1)} />
          </div>
        <PageThumbnailNavigator
            pdfFile={decodeURIComponent(pdfFiles)}
            numPages={numPages}
            currentPage={pageNumber}
            onPageChange={handlePageChange}
          />
           <Document
            file={decodeURIComponent(pdfFiles)}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onLoadError}
            options={options}
            className={"sm:mr-20 mt-20"}
          >
            <Page
              key={`page_${pageNumber}`}
              pageNumber={pageNumber}
              scale={scale}
              onLoadSuccess={() => handlePageVisible(pageNumber)}
              inputRef={(ref) => {
                pagesRef.current[pageNumber] = ref;
              }}
            />
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
