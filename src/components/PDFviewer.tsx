import React, { useRef } from 'react';
import { RxCross2 } from 'react-icons/rx';
import PDFview from './pdfrender';

const PDFViewer = ({ selectedPublication, onClose, scrolled, selectedDate }) => {
  
  const publicationContainerRef = useRef(null);
  const handleCrossButtonClick = () => {
    publicationContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    onClose();
  };

  const selectedPDFFile = selectedDate
  ? selectedPublication.pdfFiles?.find(
      file =>
        new Date(file.date).setHours(0, 0, 0, 0) ===
        selectedDate.setHours(0, 0, 0, 0)
    )
  : null;
  return (
    <div
      ref={publicationContainerRef}
      className={`mobilepdf dark:bg-[#413d3d] fixed top-0 left-0 w-full h-full bg-white z-50 overflow-y-scroll ${scrolled ? 'scrolled' : ''}`}
    >
      <div className="fixed top-0 left-0 w-full bg-gray-100 shadow-md sm:z-10 z-10 p-4 flex justify-between items-center">
        <h3 className="text-xl font-semibold font-custom3 text-gray-800">{selectedPublication.name}</h3>
        <button
          id="cross-button"
          onClick={handleCrossButtonClick}
          className={`bg-red-500 hover:bg-red-600 fixed -mt-1 text-white rounded-full text-2xl px-2 py-2 ${scrolled ? 'floating' : ''}`}
        >
          <RxCross2 />
        </button>
      </div>
      <div className="pdfview mr-72 max-w-screen-lg mx-auto py-8 mt-20">
      {selectedDate ? (
  selectedPDFFile ? (
    <PDFview onLoadSuccess={undefined} pdfFiles={encodeURIComponent(selectedPDFFile.path)} />
  ) : (
    <p className="text-center text-xl text-gray-600 mt-8">No PDF file available for the selected date.</p>
  )
) : (
  <p className="text-center text-xl text-gray-600 mt-8">Please select a date to view the PDF.</p>
)}
      </div>
    </div>
  );
};

export default PDFViewer;