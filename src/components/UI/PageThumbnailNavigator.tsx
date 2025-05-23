import React, { useMemo } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

const PageThumbnailNavigator = ({ pdfFile, numPages, currentPage, onPageChange }) => {
  const thumbnailScale = 0.08; // Adjust this value to change the thumbnail size

  const options = useMemo(() => ({
    cMapUrl: '/cmaps/',
  }), []);

  return (
    <div className="page-thumbnail-navigator dark:bg-[#c0c0c0] z-50 backdrop-saturate-75 fixed bottom-0 left-0 right-0 bg-slate-300 p-4 flex overflow-x-auto">
      {Array.from(new Array(numPages), (_, index) => (
        <div
          key={`thumbnail_${index + 1}`}
          className={`sm:mr-2 -mr-16 cursor-pointer hover:scale-110 transition-all ${
            currentPage === index + 1 ? 'active' : ''
          }`}
          onClick={() => onPageChange(index + 1)}
        >
          <Document file={pdfFile} options={options}>
            <Page pageNumber={index + 1} scale={thumbnailScale} />
          </Document>
          <div className="text-center dark:text-black sm:mr-0 mr-20">{index + 1}</div>
        </div>
      ))}
    </div>
  );
};

export default PageThumbnailNavigator;
