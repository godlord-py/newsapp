import React, { useEffect, useRef, useState } from 'react';
import { RxCross2 } from 'react-icons/rx';
import PDFview from './pdfview';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const PDFViewer = ({ selectedPublication, onClose, scrolled }) => {
    const [selectedDate, setSelectedDate] = useState(null);
    const publicationContainerRef = useRef(null);
  
    const handleDateChange = (date) => {
      setSelectedDate(date);
    };
  
    const handleCrossButtonClick = () => {
      publicationContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      onClose();
    };
  
    const dates = selectedPublication ? selectedPublication.dates.map(date => new Date(date)) : [];
  
    return (
      <div ref={publicationContainerRef} className={`mobilepdf fixed top-0 left-0 w-full h-full bg-white z-50 overflow-y-scroll ${scrolled ? 'scrolled' : ''}`}>
        <div className="fixed top-0 left-0 w-full bg-gray-100 shadow-md sm:z-10 z-10 p-4 flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-800">{selectedPublication.name}</h3>
          <button
            id="cross-button"
            onClick={handleCrossButtonClick}
            className={`bg-red-500 hover:bg-red-600 -mt-2 text-white rounded-full text-2xl px-2 py-2 ${scrolled ? 'floating' : ''}`}
          >
            <RxCross2 />
          </button>
        </div>
        <div className="pdfview mr-72 max-w-screen-lg mx-auto py-8 mt-20">
          <div className="mb-4 flex items-center">
            <span className="mr-2 text-gray-800 font-semibold">Filter by Date:</span>
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              dateFormat="yyyy-MM-dd"
              includeDates={dates}
              placeholderText="Select a date"
              className="w-3/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {selectedDate ? (
            selectedPublication.pdfFiles.find((file) => new Date(file.date).toDateString() === selectedDate.toDateString()) ? (
              <PDFview
                onLoadSuccess={undefined}
                pdfFiles={encodeURIComponent(
                  selectedPublication.pdfFiles.find((file) => new Date(file.date).toDateString() === selectedDate.toDateString()).path
                )}
              />
            ) : (
              <p className="text-center text-xl text-gray-600 mt-8">No publication available for the selected date. Stay tuned.</p>
            )
          ) : (
            <p className="text-center text-xl text-gray-600 mt-8">Please select a date from the date picker.</p>
          )}
        </div>
      </div>
    );
  };
  
  export default PDFViewer;