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
  const [scale, setScale] = useState(minScale); 
  const containerRef = useRef(null);

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
    setScale((prevScale) => Math.max(minScale, prevScale - 0.2));
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
            <Button className='nextbutton' onClick={handleZoomIn}>Zoom In</Button>
            <Button className='nextbutton' onClick={handleZoomOut}>Zoom Out</Button>
          </div>
          <Pagination
          className='pagination'
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
