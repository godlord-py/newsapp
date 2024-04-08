import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { RxCross2 } from "react-icons/rx";
import PDFview from "./pdfview";
import Dainik from "/src/assets/Dainik.jpg"
import Hitavada from "/src/assets/Hitavada.jpg"
import Lokmat from "/src/assets/LOKMAT.jpg"
import Hindustan from "/src/assets/Hindu Times.jpg"
import Times from "/src/assets/ToI Delhi 07 Apr 2024.pdf"
import Navarashtra from "/src/assets/Navbharat.jpg"
import Marathi from "/src/assets/Marathi.jpg"

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

const newspapers = [
  { id: 1, name: "Lokmat Times", imageUrl: Lokmat, pdfFilePath: Times },
  { id: 2, name: "Hindustan Times", imageUrl: Hindustan, pdfFilePath: Times },
  { id: 3, name: "Dainik Bhaskar", imageUrl: Dainik, pdfFilePath: Times },
  { id: 4, name: "The Hitvada", imageUrl: Hitavada, pdfFilePath: Times },
  { id: 5, name: "navarashtra", imageUrl: Navarashtra, pdfFilePath: Times },
  { id: 6, name: "Maharashtra Times", imageUrl: Marathi, pdfFilePath: Times },
];

const Pages = () => {
  const [selectedNewspaper, setSelectedNewspaper] = useState(null);
  const handleNewspaperClick = (newspaper) => {
    setSelectedNewspaper(newspaper); // Set the selected newspaper
  };

  return (
    <div className="dark:bg-[#111010] min-h-screen relative">
      <div className="first container mx-auto">
        <div className="mobilegrid w-11/12 ml-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          {newspapers.map((newspaper) => (
            <div
              key={newspaper.id}
              className="rounded-md overflow-hidden shadow-md cursor-pointer transition-transform hover:scale-105"
              onClick={() => handleNewspaperClick(newspaper)}
            >
              <div className="">
              <h3 className="dark:text-white text-black text-3xl py-2 text-center font-semibold capitalize mt-4 transition-all duration-300 dark:hover:text-blue-500 hover:text-blue-500 transform hover:scale-105">{newspaper.name}</h3>
              </div>
              <img src={newspaper.imageUrl} alt={newspaper.name} className="w-full h-auto" />
            </div>
          ))}
        </div>
      </div>
      {selectedNewspaper && (
        <div className="mobilepdf fixed top-0 left-0 w-full h-full bg-white z-50 overflow-y-scroll">
          <button
            onClick={() => setSelectedNewspaper(null)}
            className="absolute top-8 right-10 bg-gray-200 hover:bg-gray-300 rounded-full text-red-600 text-3xl px-3 py-2"
          >
            <RxCross2 />
          </button>
          <div className="max-w-screen-lg py-8">
            <PDFview pdfFiles={selectedNewspaper.pdfFilePath} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Pages;
