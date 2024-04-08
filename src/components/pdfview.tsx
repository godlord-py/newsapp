import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Pagination, Button } from '@nextui-org/react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

interface PDFviewProps {
  pdfFiles: string;
  onLoadSuccess?: (numPages: number) => void;
}

function PDFview({ pdfFiles, onLoadSuccess }: PDFviewProps) {
  const maxScale = 1.8;
  const minScale = 0.2;
  const [numPages, setNumPages] = useState(null); 
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1); // Initial scale
  const containerRef = useRef(null);

  useEffect(() => {
    //fixed the version from 2.0.0 to 3.11.174
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
      setScale(0.4); 
    } else {
      setScale(1); // Reset scale for larger screens
    }
  }, []);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    if (onLoadSuccess) {
      onLoadSuccess(numPages);
    }
  };

  const onLoadError = (error) => {
    console.error('Error loading PDF:', error);
  };

  const handlePageChange = (page) => {
    setPageNumber(page);
    scrollToPage(page);
  };

  const scrollToPage = (page) => {
    const pageElement = document.getElementById(`pdf-page-${page}`);
    if (pageElement) {
      pageElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  const handleZoomIn = () => {
    setScale((prevScale) => Math.min(prevScale + 0.2, maxScale));
  };

  const handleZoomOut = () => {
    setScale((prevScale) => Math.max(0.2, prevScale - 0.2, minScale));
  };

  const options = useMemo(
    () => ({
      cMapUrl: '/cmaps/',
    }),
    []
  );

  return (
    <div className='mobilepdf ml-20 w-full max-w-screen'>
      {pdfFiles && (
        <>
          <div>
            <Button onClick={handleZoomIn}>Zoom In</Button>
            <Button onClick={handleZoomOut}>Zoom Out</Button>
          </div>
          <Pagination
            total={numPages || 1}
            initialPage={pageNumber}
            onChange={handlePageChange}
          />
          <div ref={containerRef}>
            <Document
              file={pdfFiles}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onLoadError}
              options={options}
            >
              <Page pageNumber={pageNumber} scale={scale} />
            </Document>
          </div>
        </>
      )}
    </div>
  );
}

export default PDFview;
